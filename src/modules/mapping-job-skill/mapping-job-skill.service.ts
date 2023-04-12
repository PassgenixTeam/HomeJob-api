import { Injectable } from '@nestjs/common';
import { CreateMappingJobSkillDto } from './dto/create-mapping-job-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingJobSkillEntity } from './entities/mapping-job-skill.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MappingJobSkillService {
  constructor(
    @InjectRepository(MappingJobSkillEntity)
    private readonly mappingJobSkillRepository: Repository<MappingJobSkillEntity>,
  ) {}

  create(input: CreateMappingJobSkillDto) {
    return this.mappingJobSkillRepository.save({
      job: {
        id: input.jobId,
      },
      skill: {
        id: input.skillId,
      },
    });
  }

  async createMultiple(
    queryRunner: QueryRunner,
    jobId: string,
    input: string[],
  ) {
    if (!input || !input.length) {
      return true;
    }

    console.log('tao', input);

    await queryRunner.manager.save<MappingJobSkillEntity[]>(
      input.map((skillId) => {
        return plainToInstance(MappingJobSkillEntity, {
          job: {
            id: jobId,
          },
          skill: {
            id: skillId,
          },
        });
      }),
    );

    return true;
  }

  async deleteMultiple(
    queryRunner: QueryRunner,
    jobId: string,
    input: string[],
  ) {
    if (!input || !input.length) {
      return true;
    }

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(MappingJobSkillEntity)
      .where('jobId = :jobId', { jobId })
      .andWhere('skillId IN (:...skillIds)', { skillIds: input })
      .execute();

    return true;
  }

  remove(id: string) {
    return this.mappingJobSkillRepository.delete(id);
  }
}
