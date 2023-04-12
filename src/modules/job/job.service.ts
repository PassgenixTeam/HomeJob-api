import { Injectable, Logger } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { MappingJobSkillService } from '../mapping-job-skill/mapping-job-skill.service';
import { plainToInstance } from 'class-transformer';
import { differenceMultiArray, isJson, removeKeyUndefined } from '@app/common';
import { FileEntity } from '../file/entities/file.entity';
import { FileQueue } from '../file/queues/file.queue';
import _ from 'lodash';
@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private readonly mappingJobSkillService: MappingJobSkillService,
    private dataSource: DataSource,
    private readonly fileQueue: FileQueue,
  ) {}

  private readonly logger = new Logger(JobService.name);

  async create(userId: string, input: CreateJobDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const attachments = await this.fileRepository
        .createQueryBuilder('file')
        .where('file.url IN (:...urls)', { urls: input.attachments })
        .getMany();

      const job = await queryRunner.manager.save<JobEntity>(
        plainToInstance(JobEntity, {
          ...input,
          createdBy: userId,
          attachments: JSON.stringify(
            attachments.map((file) => {
              return {
                url: file.url,
                size: file.size,
              };
            }),
          ),
        }),
      );

      await this.mappingJobSkillService.createMultiple(
        queryRunner,
        job.id,
        input.skills,
      );

      await queryRunner.commitTransaction();

      await this.fileQueue.updateFileUsing(input.attachments);

      return this.findOne(job.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const jobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.mappingJobSkill', 'mappingJobSkill')
      .leftJoinAndSelect('mappingJobSkill.skill', 'skill')
      .getMany();

    const result = jobs.map(({ mappingJobSkill, ...job }) => {
      return {
        ...job,
        skills: mappingJobSkill.map((mapping) => {
          return {
            id: mapping.skill.id,
            name: mapping.skill.name,
          };
        }),
      };
    });

    return result;
  }

  async findOne(id: string): Promise<JobEntity> {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.mappingJobSkill', 'mappingJobSkill')
      .leftJoinAndSelect('mappingJobSkill.skill', 'skill')
      .where('job.id = :id', { id })
      .getOne();

    const result: JobEntity = {
      ...job,
      skills: job.mappingJobSkill.map((mapping) => {
        return {
          id: mapping.skill.id,
          name: mapping.skill.name,
        };
      }),
    };

    delete result.mappingJobSkill;

    return result;
  }

  async update(id: string, input: UpdateJobDto, userId: string) {
    let attachmentList1Only: string[] = [];
    let attachmentList2Only: string[] = [];

    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.mappingJobSkill', 'mappingJobSkill')
      .where('job.id = :id', { id })
      .getOne();

    if (!job) {
      throw new Error('Job not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const jobInstance = plainToInstance(JobEntity, input);

      if (jobInstance.attachments) {
        const { list1Only, list2Only, common } = differenceMultiArray(
          JSON.parse(job.attachments).map((file: any) => file.url),
          input.attachments,
        );

        attachmentList1Only = list1Only;
        attachmentList2Only = list2Only;

        const attachments = await this.fileRepository
          .createQueryBuilder('file')
          .where('file.url IN (:...urls)', { urls: input.attachments })
          .getMany();

        jobInstance.attachments = JSON.stringify(
          attachments.map((file) => {
            return {
              url: file.url,
              size: file.size,
            };
          }),
        );
      }

      if (input.skills) {
        const { list1Only, list2Only, common } = differenceMultiArray(
          job.mappingJobSkill.map((mapping) => mapping.skillId),
          input.skills,
        );

        await Promise.all([
          this.mappingJobSkillService.createMultiple(
            queryRunner,
            job.id,
            list2Only,
          ),
          this.mappingJobSkillService.deleteMultiple(
            queryRunner,
            job.id,
            list1Only,
          ),
        ]);
      }

      removeKeyUndefined(jobInstance);

      await queryRunner.manager.update(JobEntity, id, jobInstance);

      await queryRunner.commitTransaction();

      if (jobInstance.attachments) {
        await Promise.all([
          this.fileQueue.updateFileUsing(attachmentList2Only),
          this.fileQueue.deleteFileUsing(attachmentList1Only),
        ]);
      }
      return this.findOne(id);
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, userId: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
      },
    });

    if (job.createdBy !== userId) {
      throw new Error('You are not allowed to delete this job');
    }

    if (!job) {
      throw new Error('Job not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(JobEntity)
        .where('id = :id', { id })
        .execute();

      if (isJson(job.attachments)) {
        await this.fileQueue.deleteFileUsing(
          JSON.parse(job.attachments).map((file: any) => file.url),
        );
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
