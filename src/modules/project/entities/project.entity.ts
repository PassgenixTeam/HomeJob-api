import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  completedDate: string;

  @Column()
  template: string;

  @Column()
  attachments: string;

  @Column()
  url: string;

  @Column()
  description: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
