import { Injectable, Logger } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { MappingJobSkillService } from '../mapping-job-skill/mapping-job-skill.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  PaginationOptions,
  differenceMultiArray,
  isJson,
  removeKeyUndefined,
} from '@app/common';
import { FileEntity } from '../file/entities/file.entity';
import { FileQueue } from '../file/queues/file.queue';
import _ from 'lodash';
import { JOB_STATUS, JOB_TYPE } from './enums/job.enum';
import { QueryMyJobDto } from 'src/modules/job/dto/query-my-job.dto';
import { ProposalEntity } from 'src/modules/proposal/entities/proposal.entity';
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
      if (!input.status) {
        input.status = JOB_STATUS.DRAFT;
      }

      const jobInstance = plainToInstance(JobEntity, input);

      if (input.attachments) {
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

      if (jobInstance.budget) {
        jobInstance.jobType = JOB_TYPE.FIXED;
        jobInstance.hourlyTo = null;
        jobInstance.hourlyFrom = null;
      } else {
        jobInstance.jobType = JOB_TYPE.HOURLY;
        jobInstance.budget = null;
      }

      const job = await queryRunner.manager.save<JobEntity>(
        plainToInstance(JobEntity, {
          ...jobInstance,
          createdBy: userId,
        }),
      );

      await this.mappingJobSkillService.createMultiple(
        queryRunner,
        job.id,
        input.skills,
      );

      await queryRunner.commitTransaction();

      if (input.attachments) {
        await this.fileQueue.updateFileUsing(input.attachments);
      }

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

    const result = instanceToPlain(jobs).map(({ mappingJobSkill, ...job }) => {
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

  async myJob(
    pagination: PaginationOptions,
    query: QueryMyJobDto,
    userId: string,
  ) {
    const { search, visibility, status, type } = query;

    const { limit, page } = pagination;

    const queryJob = this.jobRepository
      .createQueryBuilder('job')
      .where('job.createdBy = :userId', { userId });

    if (search) {
      queryJob.where('job.title LIKE :search', {
        title: `%${search}%`,
      });
    }

    // if (visibility) {
    //   queryJob.andWhere('job.visibility = :visibility', { visibility });
    // }

    if (status) {
      queryJob.andWhere('job.status IN (:...status)', { status });
    }

    if (type) {
      queryJob.andWhere('job.jobType = :type', { type });
    }

    const countDocument = queryJob.getCount();
    const getJobs = queryJob
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'job.id as id',
        'job.title as title',
        'job.createdAt as "createdAt"',
        'job.updatedAt as "updatedAt"',
        'job.status as status',
      ])
      .addSelect((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COUNT(*)')
          .from(ProposalEntity, 'proposal')
          .where('proposal.jobId = job.id');
        return subQuery;
      }, 'proposalCount')
      .getRawMany();

    const [jobs, total] = await Promise.all([getJobs, countDocument]);

    return {
      data: jobs,
      currentPage: page,
      total,
    };
  }

  async findOne(id: string) {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.mappingJobSkill', 'mappingJobSkill')
      .leftJoinAndSelect('mappingJobSkill.skill', 'skill')
      .where('job.id = :id', { id })
      .getOne();

    if (!job) {
      throw new Error('Job not found');
    }

    const jobPlain = instanceToPlain(job);

    const result: JobEntity = {
      ...jobPlain,
      skills: jobPlain.mappingJobSkill?.map((mapping) => {
        return {
          id: mapping.skill.id,
          name: mapping.skill.name,
        };
      }),
    } as JobEntity;

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

      if (jobInstance.budget) {
        jobInstance.jobType = JOB_TYPE.FIXED;
        jobInstance.hourlyTo = null;
        jobInstance.hourlyFrom = null;
      } else {
        jobInstance.jobType = JOB_TYPE.HOURLY;
        jobInstance.budget = null;
      }

      jobInstance.createdBy = userId;

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
