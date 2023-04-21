import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ContractEntity } from '../../contract/entities/contract.entity';
import {
  FREELANCER_CONFIRM_STATUS,
  PROJECT_MILESTONE_STATUS,
} from '../enums/project-milestone.enum';

@Entity({ name: 'project_milestones' })
export class ProjectMilestoneEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'timestamp with time zone' })
  dueDate: Date;

  @Column({ type: 'uuid', name: 'contract_id' })
  contractId: string;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({
    type: 'enum',
    enum: FREELANCER_CONFIRM_STATUS,
    default: FREELANCER_CONFIRM_STATUS.PENDING,
  })
  freelancerConfirmStatus: FREELANCER_CONFIRM_STATUS;

  @Column({ type: 'enum', enum: PROJECT_MILESTONE_STATUS })
  status: PROJECT_MILESTONE_STATUS;

  @ManyToOne(() => ContractEntity, (contract) => contract.projectMilestones)
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
