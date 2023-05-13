import { AfterInsert, AfterUpdate, Column, Entity, OneToMany } from 'typeorm';
import { SessionEntity } from '../../session/entities/session.entity';
import { BaseEntity, ROLE, StringTransformObject } from '@app/common';
import { Expose, Transform, Type } from 'class-transformer';
import { PaymentMethodEntity } from '../../payment-method/entities/payment-method.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { CoinEntity } from '../../coin/entities/coin.entity';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';
import { EducationEntity } from '../../education/entities/education.entity';
import { EmploymentEntity } from '../../employment/entities/employment.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { ExperienceEntity } from '../../experience/entities/experience.entity';
import { MappingUserSkillEntity } from '../../mapping-user-skill/entities/mapping-user-skill.entity';
import { MappingUserLanguageEntity } from '../../mapping-user-language/entities/mapping-user-language.entity';
import { ContractEntity } from '../../contract/entities/contract.entity';
import {
  HOURS_PER_WEEK,
  PROFILE_VISIBILITY,
} from 'src/modules/user/enums/user.enum';
import { VideoOverview } from 'src/modules/user/dto/create-user.dto';
import { isJSON } from 'class-validator';
import { BiddingContractEntity } from 'src/modules/bidding-contract/entities/bidding-contract.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    default:
      // eslint-disable-next-line max-len
      'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=',
  })
  avatarUrl: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @Column({ type: 'enum', enum: ROLE, nullable: true })
  role: ROLE;

  @Column({ type: 'varchar', length: 50, nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  line1: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  line2: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ default: 0, type: 'float' })
  balance: number;

  @Column({ default: 0, type: 'float' })
  coin: number;

  @Column({ type: 'varchar', length: 70, nullable: true })
  title: string;

  @Column({ type: 'float', default: 0 })
  hourlyRate: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @StringTransformObject()
  videoOverview: VideoOverview;

  @Column({ type: 'enum', enum: HOURS_PER_WEEK, nullable: true })
  hoursPerWeek: HOURS_PER_WEEK;

  @Column({ type: 'boolean', default: false })
  contractToHire: boolean;

  @Column()
  loginBy: string;

  @Column({ type: 'integer', default: 0 })
  profileCompletion: number;

  @Column({ type: 'boolean', default: false })
  isPaymentVerified: boolean;

  @Column({
    type: 'enum',
    enum: PROFILE_VISIBILITY,
    default: PROFILE_VISIBILITY.PUBLIC,
  })
  profileVisibility: PROFILE_VISIBILITY;

  // ----------------- Relations -----------------
  @OneToMany(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.user)
  paymentMethods: PaymentMethodEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  @OneToMany(() => CoinEntity, (coin) => coin.user)
  coins: CoinEntity[];

  @OneToMany(() => ProposalEntity, (proposal) => proposal.user, {
    onDelete: 'CASCADE',
  })
  proposals: ProposalEntity[];

  @OneToMany(() => EducationEntity, (education) => education.user, {
    onDelete: 'CASCADE',
  })
  educations: EducationEntity[];

  @OneToMany(() => EmploymentEntity, (employment) => employment.user, {
    onDelete: 'CASCADE',
  })
  employments: EmploymentEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.user, {
    onDelete: 'CASCADE',
  })
  projects: ProjectEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.user, {
    onDelete: 'CASCADE',
  })
  experiences: ExperienceEntity[];

  @OneToMany(() => MappingUserLanguageEntity, (language) => language.user, {
    onDelete: 'CASCADE',
  })
  mappingUserLanguageEntity: MappingUserLanguageEntity[];

  @OneToMany(
    () => MappingUserSkillEntity,
    (mappingUserSkill) => mappingUserSkill.user,
    {
      onDelete: 'CASCADE',
    },
  )
  mappingUserSkill: MappingUserSkillEntity[];

  @OneToMany(() => ContractEntity, (contract) => contract.freelancer, {
    onDelete: 'CASCADE',
  })
  contract: ContractEntity[];

  @OneToMany(
    () => BiddingContractEntity,
    (biddingContract) => biddingContract.contractor,
    {
      onDelete: 'CASCADE',
    },
  )
  biddingContracts: BiddingContractEntity[];

  // ----------------- Expose -----------------

  @Expose()
  loginSession: SessionEntity;

  @Expose()
  cacheId: string;

  // ----------------- Methods -----------------
  @AfterInsert()
  @AfterUpdate()
  async afterInsert() {
    if (!this.videoOverview) return;
    this.videoOverview = JSON.stringify(this.videoOverview) as any;
  }
}
