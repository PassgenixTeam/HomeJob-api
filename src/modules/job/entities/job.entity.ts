import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common';
import { MappingJobSkillEntity } from '../../mapping-job-skill/entities/mapping-job-skill.entity';
import { Exclude } from 'class-transformer';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  description: string;

  @Column()
  scopeType: string;

  @Column()
  scopeLevel: string;

  @Column()
  scopeTime: string;

  @Column()
  budget: number;

  @Column()
  hourlyTo: number;

  @Column()
  hourlyFrom: number;

  @Column()
  attachments: string;

  @Column()
  status: string;

  @OneToMany(
    () => MappingJobSkillEntity,
    (mappingJobSkill) => mappingJobSkill.job,
    {
      onDelete: 'CASCADE',
    },
  )
  mappingJobSkill: MappingJobSkillEntity[];

  @Exclude()
  skills?: DeepPartial<SubSkillEntity[]>;
}
