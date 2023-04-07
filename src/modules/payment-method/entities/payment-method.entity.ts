import { BaseEntity } from '@app/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

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
}
