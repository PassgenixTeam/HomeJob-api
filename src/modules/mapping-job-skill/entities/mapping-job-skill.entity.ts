import { BaseEntity } from '@app/common';
import { Entity, ManyToOne } from 'typeorm';
import { JobEntity } from '../../job/entities/job.entity';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';

@Entity({ name: 'mapping_job_skills' })
export class MappingJobSkillEntity extends BaseEntity {
  @ManyToOne(() => JobEntity, (job) => job.mappingJobSkill)
  job: JobEntity;

  @ManyToOne(() => SubSkillEntity, (skill) => skill.mappingJobSkill)
  skill: SubSkillEntity;
}
