import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SkillEntity } from '../../skill/entities/skill.entity';
import { MappingJobSkillEntity } from '../../mapping-job-skill/entities/mapping-job-skill.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'sub_skills' })
export class SubSkillEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => SkillEntity, (skill) => skill.subSkills)
  @JoinColumn()
  skill: SkillEntity;

  @OneToMany(
    () => MappingJobSkillEntity,
    (mappingJobSkill) => mappingJobSkill.skill,
  )
  mappingJobSkill: MappingJobSkillEntity[];
}
