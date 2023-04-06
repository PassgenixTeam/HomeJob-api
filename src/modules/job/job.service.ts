import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
  ) {}

  create(userId: string, createJobDto: CreateJobDto) {
    return this.jobRepository.save({
      ...createJobDto,
      createdBy: userId,
    });
  }

  findAll() {
    return this.jobRepository.find();
  }

  findOne(id: string) {
    return this.jobRepository.findOne({ where: { id } });
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.jobRepository.update(id, updateJobDto);
  }

  remove(id: string) {
    return this.jobRepository.delete(id);
  }
}
