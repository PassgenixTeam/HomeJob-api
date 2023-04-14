import { Column, Entity, OneToMany } from 'typeorm';
import { SessionEntity } from '../../session/entities/session.entity';
import { BaseEntity, ROLE } from '@app/common';
import { Expose } from 'class-transformer';
import { PaymentMethodEntity } from '../../payment-method/entities/payment-method.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { CoinEntity } from '../../coin/entities/coin.entity';
import { ProposalEntity } from '../../proposal/entities/proposal.entity';
import { EducationEntity } from '../../education/entities/education.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    default:
      // eslint-disable-next-line max-len
      'https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=',
  })
  avatarUrl: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @Column({ default: ROLE.FREELANCE })
  role: ROLE;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  line1: string;

  @Column({ nullable: true })
  line2: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: 0, type: 'float' })
  balance: number;

  @Column({ default: 0, type: 'float' })
  coin: number;

  @Column()
  loginBy: string;

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

  // ----------------- Expose -----------------

  @Expose()
  loginSession: SessionEntity;

  @Expose()
  cacheId: string;
}
