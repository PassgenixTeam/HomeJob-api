import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SkillEntity } from '../../skill/entities/skill.entity';
import { MappingJobSkillEntity } from '../../mapping-job-skill/entities/mapping-job-skill.entity';
import { MappingUserSkillEntity } from '../../mapping-user-skill/entities/mapping-user-skill.entity';

@Entity({ name: 'sub_skills' })
export class SubSkillEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => SkillEntity, (skill) => skill.subSkills)
  @JoinColumn()
  skill: SkillEntity;

  @OneToMany(
    () => MappingJobSkillEntity,
    (mappingJobSkill) => mappingJobSkill.skill,
    {
      onDelete: 'CASCADE',
    },
  )
  mappingJobSkill: MappingJobSkillEntity[];

  @OneToMany(
    () => MappingUserSkillEntity,
    (mappingUserSkill) => mappingUserSkill.skill,
    {
      onDelete: 'CASCADE',
    },
  )
  mappingUserSkill: MappingUserSkillEntity[];
}
