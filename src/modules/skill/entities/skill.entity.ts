import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';
import { BaseEntity } from '@app/common';

@Entity({ name: 'skills' })
export class SkillEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => SubSkillEntity, (subSkill) => subSkill.skill)
  @JoinColumn()
  subSkills: SubSkillEntity[];
}
