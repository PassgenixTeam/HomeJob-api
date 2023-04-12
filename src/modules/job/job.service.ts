import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { MappingJobSkillService } from '../mapping-job-skill/mapping-job-skill.service';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '@app/common';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
    private readonly mappingJobSkillService: MappingJobSkillService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, input: CreateJobDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const job = await queryRunner.manager.save<JobEntity>(
        plainToInstance(JobEntity, {
          ...input,
          createdBy: userId,
        }),
      );

      await this.mappingJobSkillService.createMultiple(
        queryRunner,
        job.id,
        input.skills,
      );

      await queryRunner.commitTransaction();

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

  update(id: string, input: UpdateJobDto) {
    const job = plainToInstance(JobEntity, input);
    removeKeyUndefined(job);

    return this.jobRepository.update(id, job);
  }

  remove(id: string) {
    return this.jobRepository.delete(id);
  }
}
