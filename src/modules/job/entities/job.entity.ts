import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common';
import { MappingJobSkillEntity } from '../../mapping-job-skill/entities/mapping-job-skill.entity';
import { Exclude } from 'class-transformer';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';
import {
  EXPERIENCE_LEVEL,
  JOB_STATUS,
  JOB_TYPE,
  PROJECT_LENGTH,
  SCOPE_TYPE,
} from '../enums/job.enum';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: SCOPE_TYPE })
  scopeType: SCOPE_TYPE;

  @Column({ type: 'enum', enum: EXPERIENCE_LEVEL })
  experienceLevel: EXPERIENCE_LEVEL;

  @Column({ type: 'enum', enum: PROJECT_LENGTH })
  projectLength: PROJECT_LENGTH;

  @Column({ type: 'float', nullable: true })
  budget: number;

  @Column({ type: 'integer', nullable: true })
  hourlyTo: number;

  @Column({ type: 'integer', nullable: true })
  hourlyFrom: number;

  @Column({ type: 'text' })
  attachments: string;

  @Column({ type: 'enum', enum: JOB_TYPE })
  jobType: JOB_TYPE;

  @Column({ type: 'enum', enum: JOB_STATUS })
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
