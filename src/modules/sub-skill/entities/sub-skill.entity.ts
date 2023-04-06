import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SkillEntity } from '../../skill/entities/skill.entity';

@Entity({ name: 'sub_skills' })
export class SubSkillEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => SkillEntity, (skill) => skill.subSkills)
  @JoinColumn()
  skill: SkillEntity;
}
