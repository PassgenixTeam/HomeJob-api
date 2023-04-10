import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentMethodEntity } from '../../payment-method/entities/payment-method.entity';

@Entity({ name: 'transaction' })
export class TransactionEntity extends BaseEntity {
  @Column()
  type: string;

  @Column()
  refId: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  balance: number;

  @Column({ name: 'payment_method_id', type: 'uuid' })
  paymentMethodId: string;

  @Column({ nullable: true, name: 'freelancer_id', type: 'uuid' })
  freelancerId: string;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'created_by' })
  user: UserEntity;

  @ManyToOne(
    () => PaymentMethodEntity,
    (paymentMethod) => paymentMethod.transactions,
  )
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethodEntity;
}
