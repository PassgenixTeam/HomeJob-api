import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobEntity } from './entities/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingJobSkillService } from '../mapping-job-skill/mapping-job-skill.service';
import { MappingJobSkillEntity } from '../mapping-job-skill/entities/mapping-job-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity, MappingJobSkillEntity])],
  controllers: [JobController],
  providers: [JobService, MappingJobSkillService],
})
export class JobModule {}
