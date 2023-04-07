import { Module } from '@nestjs/common';
import { MappingJobSkillService } from './mapping-job-skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingJobSkillEntity } from './entities/mapping-job-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MappingJobSkillEntity])],
  controllers: [],
  providers: [MappingJobSkillService],
})
export class MappingJobSkillModule {}
