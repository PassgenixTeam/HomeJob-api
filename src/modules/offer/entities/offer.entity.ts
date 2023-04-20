import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { OFFER_STATUS, PAY_TYPE } from '../enums/offer.enum';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'offers' })
export class OfferEntity extends BaseEntity {
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

  @Column({ type: 'text', nullable: true })
  projectMilestones: string;

  @Column({ type: 'enum', enum: OFFER_STATUS })
  status: OFFER_STATUS;

  //  relations

  @ManyToOne(() => UserEntity, (user) => user.offers)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: UserEntity;
}
