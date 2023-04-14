import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'employment' })
export class EmploymentEntity extends BaseEntity {
  @Column()
  company: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  title: string;

  @Column()
  fromMonth: number;

  @Column()
  fromYear: number;

  @Column()
  toMonth: number;

  @Column()
  toYear: number;

  @Column()
  isCurrently: boolean;

  @Column()
  description: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.employments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
