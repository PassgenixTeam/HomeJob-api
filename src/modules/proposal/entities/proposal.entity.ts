import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, StringTransformObject } from '@app/common';
import { JobEntity } from '../../job/entities/job.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Transform } from 'class-transformer';
import { isJSON } from 'class-validator';

@Entity({ name: 'proposals' })
export class ProposalEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paidType: string;

  @Column({ type: 'float', default: 0, nullable: true })
  amount: number;

  @Column({ type: 'float', default: 0, nullable: true })
  bid: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  @StringTransformObject()
  milestones: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  projectLong: string;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ type: 'text', nullable: true })
  @StringTransformObject()
  attachments: string;

  @Column({ type: 'integer', default: 0 })
  boostCoin: number;

  @Column({ type: 'timestamp', nullable: true })
  boostTime: Date;

  @Column({ type: 'float', nullable: true })
  bidding: number;

  @Column({ type: 'integer', default: 0 })
  estimatedTime: number;

  @Column({ type: 'integer', default: 0 })
  estimatedLabor: number;

  @Column({ type: 'float', default: 0 })
  estimateBudget: number;

  @ManyToOne(() => JobEntity, (job) => job.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;

  @ManyToOne(() => UserEntity, (user) => user.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  oraiProject: string;
}
