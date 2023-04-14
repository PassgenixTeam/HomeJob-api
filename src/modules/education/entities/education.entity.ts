import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'educations' })
export class EducationEntity extends BaseEntity {
  @Column()
  school: string;

  @Column()
  degree: string;

  @Column()
  fromAttended: string;

  @Column()
  toAttended: string;

  @Column()
  areaOfStudy: string;

  @Column()
  description: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.educations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
