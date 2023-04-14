import { Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationEntity } from './entities/education.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '../../../libs/common/src';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  async create(input: CreateEducationDto, userId: string) {
    const educationInstance = plainToInstance(EducationEntity, input);

    educationInstance.userId = userId;

    return this.educationRepository.save(educationInstance);
  }

  findAll() {
    return this.educationRepository.find();
  }

  findOne(id: string) {
    return this.educationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, input: UpdateEducationDto, userId: string) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
      },
    });

    if (!education) {
      throw new Error('Education not found');
    }

    if (education.userId !== userId) {
      throw new Error('You are not authorized to update this education');
    }

    const educationInstance = plainToInstance(EducationEntity, input);

    removeKeyUndefined(educationInstance);

    return this.educationRepository.save({
      ...education,
      ...educationInstance,
    });
  }

  async remove(id: string, userId: string) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
      },
    });

    if (!education) {
      throw new Error('Education not found');
    }

    if (education.userId !== userId) {
      throw new Error('You are not authorized to delete this education');
    }

    return this.educationRepository
      .createQueryBuilder()
      .delete()
      .from(EducationEntity)
      .where('id = :id', { id })
      .execute();
  }
}
