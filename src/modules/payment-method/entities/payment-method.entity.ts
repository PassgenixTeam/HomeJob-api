import { BaseEntity } from '@app/common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';

@Entity({ name: 'payment_methods' })
export class PaymentMethodEntity extends BaseEntity {
  @Column()
  last4: string;

  @Column()
  paymentMethodId: string;

  @Column()
  brand: string;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (user) => user.paymentMethods)
  user: UserEntity;

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.paymentMethod,
  )
  transactions: TransactionEntity[];
}
