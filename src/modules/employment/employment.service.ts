import { Injectable } from '@nestjs/common';
import { CreateEmploymentDto } from './dto/create-employment.dto';
import { UpdateEmploymentDto } from './dto/update-employment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmploymentEntity } from './entities/employment.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '../../../libs/common/src';

@Injectable()
export class EmploymentService {
  constructor(
    @InjectRepository(EmploymentEntity)
    private readonly employmentRepository: Repository<EmploymentEntity>,
  ) {}

  create(input: CreateEmploymentDto, userId: string) {
    const employmentInstance = plainToInstance(EmploymentEntity, input);
    employmentInstance.userId = userId;

    return this.employmentRepository.save(employmentInstance);
  }

  findAll() {
    return this.employmentRepository.find();
  }

  async findOne(id: string) {
    const employment = await this.employmentRepository.findOne({
      where: { id },
    });

    if (!employment) {
      throw new Error('Employment not found');
    }

    return employment;
  }

  async update(id: string, input: UpdateEmploymentDto, userId: string) {
    const employment = await this.employmentRepository.findOne({
      where: { id },
    });

    if (!employment) {
      throw new Error('Employment not found');
    }

    if (employment.userId !== userId) {
      throw new Error('You are not allowed to update this employment');
    }

    const employmentInstance = plainToInstance(EmploymentEntity, input);

    removeKeyUndefined(employmentInstance);

    return this.employmentRepository.save({
      ...employment,
      ...employmentInstance,
    });
  }

  async remove(id: string, userId: string) {
    const employment = await this.employmentRepository.findOne({
      where: { id },
    });

    if (!employment) {
      throw new Error('Employment not found');
    }

    if (employment.userId !== userId) {
      throw new Error('You are not allowed to delete this employment');
    }

    return this.employmentRepository
      .createQueryBuilder()
      .delete()
      .from(EmploymentEntity)
      .where('id = :id', { id })
      .execute();
  }
}
