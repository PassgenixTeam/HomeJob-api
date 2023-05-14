import {
  BaseEntity,
  ObjectTransformToString,
  StringTransformObject,
} from '@app/common';
import { JobEntity } from 'src/modules/job/entities/job.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'bidding_contracts' })
export class BiddingContractEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'contractor_id' })
  contractorId: string;

  @ManyToOne(() => UserEntity, (user) => user.biddingContracts, {
    onDelete: 'CASCADE',
  })
  contractor: UserEntity;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @ManyToOne(() => JobEntity, (job) => job.biddingContracts, {
    onDelete: 'CASCADE',
  })
  job: JobEntity;

  @Column({ type: 'uuid', name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => UserEntity, (user) => user.biddingContracts, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;

  @Column({ type: 'text', nullable: true })
  @StringTransformObject()
  @ObjectTransformToString()
  information: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  txHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  approvedTxHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oraiJobId: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  oraiFile: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;
}
