import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import {
  BaseEntity,
  ObjectTransformToString,
  StringTransformObject,
} from '@app/common';
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
import { BiddingContractEntity } from 'src/modules/bidding-contract/entities/bidding-contract.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: SCOPE_TYPE, default: SCOPE_TYPE.SMALL })
  scopeType: SCOPE_TYPE;

  @Column({
    type: 'enum',
    enum: EXPERIENCE_LEVEL,
    default: EXPERIENCE_LEVEL.ENTRY_LEVEL,
  })
  experienceLevel: EXPERIENCE_LEVEL;

  @Column({
    type: 'enum',
    enum: PROJECT_LENGTH,
    default: PROJECT_LENGTH.LESS_THAN_ONE_MONTH,
  })
  projectLength: PROJECT_LENGTH;

  @Column({ type: 'float', nullable: true })
  budget: number;

  @Column({ type: 'integer', nullable: true })
  hourlyTo: number;

  @Column({ type: 'integer', nullable: true })
  hourlyFrom: number;

  @Column({ type: 'text', nullable: true })
  @StringTransformObject()
  attachments: string;

  @Column({ type: 'enum', enum: JOB_TYPE })
  jobType: JOB_TYPE;

  @Column({ type: 'enum', enum: JOB_STATUS })
  status: JOB_STATUS;

  @Column({ type: 'integer', default: 0 })
  estimate: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  @StringTransformObject()
  @ObjectTransformToString()
  moreInfo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  txHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oraiJobId: string;

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

  @OneToMany(
    () => BiddingContractEntity,
    (biddingContract) => biddingContract.contractor,
    {
      onDelete: 'CASCADE',
    },
  )
  biddingContracts: BiddingContractEntity[];
}
