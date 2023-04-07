import { Injectable } from '@nestjs/common';
import { CreateMappingJobSkillDto } from './dto/create-mapping-job-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingJobSkillEntity } from './entities/mapping-job-skill.entity';
import { QueryRunner, Repository } from 'typeorm';
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
    // get all skill in job
    const skills = await this.mappingJobSkillRepository.find({
      where: {
        job: {
          id: jobId,
        },
      },
    });

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

    return skills;
  }

  remove(id: string) {
    return this.mappingJobSkillRepository.delete(id);
  }
}
