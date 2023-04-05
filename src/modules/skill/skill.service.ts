import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  create(input: CreateSkillDto) {
    return this.skillRepository.save(input);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: string) {
    return this.skillRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, input: UpdateSkillDto) {
    const skill = this.skillRepository.findOne({
      where: {
        id,
      },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    return this.skillRepository.update(id, input);
  }

  remove(id: string) {
    return this.skillRepository.delete(id);
  }
}
