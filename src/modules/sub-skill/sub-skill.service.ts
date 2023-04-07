import { Injectable } from '@nestjs/common';
import { CreateSubSkillDto } from './dto/create-sub-skill.dto';
import { UpdateSubSkillDto } from './dto/update-sub-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSkillEntity } from './entities/sub-skill.entity';
import { Repository } from 'typeorm';
import { FilterSubSkillDto } from './dto/filter-sub-skill.dto';

@Injectable()
export class SubSkillService {
  constructor(
    @InjectRepository(SubSkillEntity)
    private readonly subSkillRepository: Repository<SubSkillEntity>,
  ) {}

  create(input: CreateSubSkillDto) {
    return this.subSkillRepository.save({
      name: input.name,
      skill: {
        id: input.skillId,
      },
    });
  }

  findAll(filter: FilterSubSkillDto) {
    const query = this.subSkillRepository.createQueryBuilder('subSkill');

    if (filter.name) {
      query.andWhere('subSkill.name LIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.skillId) {
      query.andWhere('subSkill.skill_id = :skillId', {
        skillId: filter.skillId,
      });
    }

    return query
      .select(['subSkill.id', 'subSkill.name', 'skill.id'])
      .leftJoin('subSkill.skill', 'skill')
      .addSelect(['skill.id', 'skill.name'])
      .getMany();
  }

  findOne(id: string) {
    return this.subSkillRepository.findOne({
      where: {
        id,
      },
      relations: {
        skill: true,
      },
    });
  }

  update(id: string, input: UpdateSubSkillDto) {
    const skill = this.subSkillRepository.findOne({
      where: {
        id,
      },
    });

    if (!skill) {
      throw new Error('Sub skill not found');
    }

    return this.subSkillRepository.update(id, input);
  }

  remove(id: string) {
    return this.subSkillRepository.delete(id);
  }
}
