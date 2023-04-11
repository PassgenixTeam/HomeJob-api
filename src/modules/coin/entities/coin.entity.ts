import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BaseEntity } from '@app/common';

@Entity({ name: 'coins' })
export class CoinEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  reason: string;

  @Column()
  coin: number;

  @Column()
  balance: number;

  @Column()
  type: string;

  @ManyToOne(() => UserEntity, (user) => user.coins)
  user: UserEntity;
}
