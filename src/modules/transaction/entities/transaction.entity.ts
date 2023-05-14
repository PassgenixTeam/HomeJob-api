import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentMethodEntity } from '../../payment-method/entities/payment-method.entity';

@Entity({ name: 'transaction' })
export class TransactionEntity extends BaseEntity {
  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  refId: string;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  balance: number;

  @Column({ name: 'payment_method_id', type: 'uuid', nullable: true })
  paymentMethodId: string;

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
