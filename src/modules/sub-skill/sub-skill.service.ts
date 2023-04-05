import { Injectable } from '@nestjs/common';
import { CreateSubSkillDto } from './dto/create-sub-skill.dto';
import { UpdateSubSkillDto } from './dto/update-sub-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSkillEntity } from './entities/sub-skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubSkillService {
  constructor(
    @InjectRepository(SubSkillEntity)
    private readonly skillRepository: Repository<SubSkillEntity>,
  ) {}

  create(input: CreateSubSkillDto) {
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

  update(id: string, input: UpdateSubSkillDto) {
    const skill = this.skillRepository.findOne({
      where: {
        id,
      },
    });

    if (!skill) {
      throw new Error('Sub skill not found');
    }

    return this.skillRepository.update(id, input);
  }

  remove(id: string) {
    return this.skillRepository.delete(id);
  }
}
