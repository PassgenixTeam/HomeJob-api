import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { JobEntity } from '../../job/entities/job.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'proposals' })
export class ProposalEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column()
  paidType: string;

  @Column()
  amount: number;

  @Column()
  milestones: string;

  @Column()
  projectLong: string;

  @Column()
  coverLetter: string;

  @Column()
  attachments: string;

  @Column()
  boostCoin: number;

  @Column()
  boostTime: Date;

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
}
