import { Module } from '@nestjs/common';
import { ProjectMilestoneService } from './project-milestone.service';
import { ProjectMilestoneController } from './project-milestone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '../contract/entities/contract.entity';
import { ProjectMilestoneEntity } from './entities/project-milestone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMilestoneEntity, ContractEntity])],
  controllers: [ProjectMilestoneController],
  providers: [ProjectMilestoneService],
})
export class ProjectMilestoneModule {}
