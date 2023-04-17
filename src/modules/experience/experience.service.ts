import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperienceEntity } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '../../../libs/common/src';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly experienceRepository: Repository<ExperienceEntity>,
  ) {}

  create(input: CreateExperienceDto, userId: string) {
    const experienceInstance = plainToInstance(ExperienceEntity, input);
    experienceInstance.userId = userId;

    return this.experienceRepository.save(experienceInstance);
  }

  findAll() {
    return this.experienceRepository.find();
  }

  findOne(id: string) {
    return this.experienceRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, input: UpdateExperienceDto, userId: string) {
    const experience = await this.experienceRepository.findOne({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new Error('Experience not found');
    }

    if (experience.userId !== userId) {
      throw new Error('You are not allowed to update this experience');
    }

    const experienceInstance = plainToInstance(ExperienceEntity, input);

    removeKeyUndefined(experienceInstance);

    return this.experienceRepository.save({
      ...experience,
      ...experienceInstance,
    });
  }

  async remove(id: string, userId: string) {
    const experience = await this.experienceRepository.findOne({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new Error('Experience not found');
    }

    if (experience.userId !== userId) {
      throw new Error('You are not allowed to delete this experience');
    }

    return this.experienceRepository
      .createQueryBuilder()
      .delete()
      .from(ExperienceEntity)
      .where('id = :id', { id })
      .execute();
  }
}
