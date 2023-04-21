import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  CONTRACT_STATUS,
  OFFER_STATUS,
  PAY_STATUS,
  PAY_TYPE,
} from '../enums/contract.enum';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'contracts' })
export class ContractEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'contract_id' })
  contractId: string;

  @Column({ type: 'uuid', name: 'freelancer_id' })
  freelancerId: string;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column({ type: 'enum', enum: PAY_TYPE })
  payType: PAY_TYPE;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dueDate: Date;

  @Column({ type: 'float', nullable: true })
  payFixedPrice: number;

  @Column({ type: 'enum', enum: OFFER_STATUS })
  offerStatus: OFFER_STATUS;

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

  @Column({ type: 'enum', enum: CONTRACT_STATUS })
  status: CONTRACT_STATUS;

  //  relations

  @ManyToOne(() => UserEntity, (user) => user.contract)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: UserEntity;
}
