import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';

@Entity({ name: 'mapping_user_skills' })
export class MappingUserSkillEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.mappingUserSkill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'uuid', name: 'sub_skill_id' })
  skillId: string;

  @ManyToOne(() => SubSkillEntity, (user) => user.mappingUserSkill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sub_skill_id' })
  skill: SubSkillEntity;
}
