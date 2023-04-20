import { BaseEntity } from '@app/common';
import { Column, Entity } from 'typeorm';
import { PAY_STATUS } from '../enums/contract.enum';

@Entity({ name: 'contracts' })
export class ContractEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'offer_id' })
  offerId: string;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column({ type: 'uuid', name: 'freelancer_id' })
  freelancerId: string;

  @Column({ type: 'float' })
  deposit: number;

  @Column({ type: 'float', nullable: true })
  fee: number;

  @Column({ type: 'float', nullable: true })
  taxes: number;

  @Column({ type: 'float', nullable: true })
  total: number;

  @Column({ type: 'enum', enum: PAY_STATUS })
  payStatus: PAY_STATUS;
}
