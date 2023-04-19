import { Injectable } from '@nestjs/common';
import { CreateMappingUserSkillDto } from './dto/create-mapping-user-skill.dto';
import { UpdateMappingUserSkillDto } from './dto/update-mapping-user-skill.dto';
import { MappingUserSkillEntity } from './entities/mapping-user-skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SubSkillEntity } from '../sub-skill/entities/sub-skill.entity';
import { differenceMultiArray } from '@app/common';

@Injectable()
export class MappingUserSkillService {
  constructor(
    @InjectRepository(MappingUserSkillEntity)
    private readonly mappingUserSkillRepository: Repository<MappingUserSkillEntity>,
    @InjectRepository(SubSkillEntity)
    private readonly subSkillRepository: Repository<SubSkillEntity>,
  ) {}

  create(input: CreateMappingUserSkillDto, userId: string) {
    const mappingUserSkillInstance = plainToInstance(
      MappingUserSkillEntity,
      input,
    );

    mappingUserSkillInstance.userId = userId;

    return this.mappingUserSkillRepository.save(mappingUserSkillInstance);
  }

  async createMultiple(
    input: string[],
    userId: string,
    queryRunner: QueryRunner,
  ) {
    const skills = await this.mappingUserSkillRepository.find({
      where: {
        userId: userId,
      },
    });
    const { list1Only, list2Only, common } = differenceMultiArray(
      skills.map((item) => item.skillId),
      input,
    );

    const mappingUserSkillInstances = await Promise.all(
      list2Only.map(async (item) => {
        const subSKill = await this.subSkillRepository.findOne({
          where: {
            id: item,
          },
        });

        if (!subSKill) {
          throw new Error('SubSkill not found');
        }

        const mappingUserSkillInstance = plainToInstance(
          MappingUserSkillEntity,
          item,
        );

        mappingUserSkillInstance.userId = userId;

        return mappingUserSkillInstance;
      }),
    );

    return Promise.all([
      queryRunner.manager.save(mappingUserSkillInstances),
      this.deleteMultiple(list1Only, userId, queryRunner),
    ]);
  }

  findAll() {
    return this.mappingUserSkillRepository.find();
  }

  remove(id: string, userId: string) {
    return this.mappingUserSkillRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('user_id = :userId', { userId })
      .execute();
  }

  async deleteMultiple(
    ids: string[],
    userId: string,
    queryRunner: QueryRunner,
  ) {
    if (!ids.length) {
      return;
    }

    return queryRunner.manager
      .createQueryBuilder()
      .delete()
      .where('id IN (:...id)', { ids })
      .andWhere('user_id = :userId', { userId })
      .execute();
  }
}
