import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common';
import { MappingJobSkillEntity } from '../../mapping-job-skill/entities/mapping-job-skill.entity';
import { Exclude } from 'class-transformer';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';
import {
  EXPERIENCE_LEVEL,
  JOB_STATUS,
  PROJECT_LENGTH,
  SCOPE_TYPE,
} from '../enums/job.enum';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  description: string;

  @Column()
  scopeType: SCOPE_TYPE;

  @Column()
  experienceLevel: EXPERIENCE_LEVEL;

  @Column()
  projectLength: PROJECT_LENGTH;

  @Column()
  budget: number;

  @Column()
  hourlyTo: number;

  @Column()
  hourlyFrom: number;

  @Column()
  attachments: string;

  @Column()
  status: JOB_STATUS;

  @OneToMany(
    () => MappingJobSkillEntity,
    (mappingJobSkill) => mappingJobSkill.job,
    {
      onDelete: 'CASCADE',
    },
  )
  mappingJobSkill: MappingJobSkillEntity[];

  @OneToMany(() => ProposalEntity, (proposal) => proposal.job, {
    onDelete: 'CASCADE',
  })
  proposals: ProposalEntity[];

  @Exclude()
  skills?: DeepPartial<SubSkillEntity[]>;
}
