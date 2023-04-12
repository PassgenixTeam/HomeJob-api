import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JobEntity } from '../../job/entities/job.entity';
import { SubSkillEntity } from '../../sub-skill/entities/sub-skill.entity';

@Entity({ name: 'mapping_job_skills' })
export class MappingJobSkillEntity extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'skill_id' })
  skillId: string;

  @ManyToOne(() => JobEntity, (job) => job.mappingJobSkill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;

  @ManyToOne(() => SubSkillEntity, (skill) => skill.mappingJobSkill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: SubSkillEntity;
}
