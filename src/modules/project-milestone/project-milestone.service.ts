import { Injectable } from '@nestjs/common';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { ProjectMilestoneEntity } from './entities/project-milestone.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ContractEntity } from '../contract/entities/contract.entity';
import {
  FREELANCER_CONFIRM_STATUS,
  PROJECT_MILESTONE_STATUS,
} from './enums/project-milestone.enum';
import { removeKeyUndefined } from '../../../libs/common/src';

@Injectable()
export class ProjectMilestoneService {
  constructor(
    @InjectRepository(ProjectMilestoneEntity)
    private readonly projectMilestoneRepository: Repository<ProjectMilestoneEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {}

  async create(input: CreateProjectMilestoneDto, userId: string) {
    const contract = await this.contractRepository.findOne({
      where: { id: input.contractId },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    if (contract.createdBy !== userId) {
      throw new Error('You are not the owner of this contract');
    }

    const projectMilestoneInstance = plainToInstance(
      ProjectMilestoneEntity,
      input,
    );

    projectMilestoneInstance.createdBy = userId;

    projectMilestoneInstance.freelancerConfirmStatus =
      FREELANCER_CONFIRM_STATUS.PENDING;

    projectMilestoneInstance.status = PROJECT_MILESTONE_STATUS.PENDING;

    projectMilestoneInstance.isPaid = false;

    return this.projectMilestoneRepository.save(projectMilestoneInstance);
  }

  async update(id: string, input: UpdateProjectMilestoneDto, userId: string) {
    const projectMilestone = await this.projectMilestoneRepository.findOne({
      where: { id },
    });

    if (!projectMilestone) {
      throw new Error('Project milestone not found');
    }

    if (projectMilestone.createdBy !== userId) {
      throw new Error('You are not the owner of this project milestone');
    }

    if (
      projectMilestone.status === PROJECT_MILESTONE_STATUS.ACTIVE_AND_FUNDED ||
      projectMilestone.status === PROJECT_MILESTONE_STATUS.PAID
    ) {
      throw new Error('You cannot update this project milestone');
    }

    const projectMilestoneInstance = plainToInstance(
      ProjectMilestoneEntity,
      input,
    );

    removeKeyUndefined(projectMilestoneInstance);

    delete projectMilestoneInstance.contractId;

    return this.projectMilestoneRepository
      .createQueryBuilder()
      .update()
      .set(projectMilestoneInstance)
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: string, userId: string) {
    const projectMilestone = await this.projectMilestoneRepository.findOne({
      where: { id },
    });

    if (!projectMilestone) {
      throw new Error('Project milestone not found');
    }

    if (projectMilestone.createdBy !== userId) {
      throw new Error('You are not the owner of this project milestone');
    }

    return this.projectMilestoneRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
