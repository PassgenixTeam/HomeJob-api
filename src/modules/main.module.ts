import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StripeModule } from '@app/payment';
import { PaypalModule } from '../../libs/payment/src/modules/paypal/paypal.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { SkillModule } from './skill/skill.module';
import { SubSkillModule } from './sub-skill/sub-skill.module';
import { JobModule } from './job/job.module';
import { MappingJobSkillModule } from './mapping-job-skill/mapping-job-skill.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { TransactionModule } from './transaction/transaction.module';
import { CoinModule } from './coin/coin.module';
import { ProposalModule } from './proposal/proposal.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    StripeModule,
    PaypalModule,
    FileModule,
    SkillModule,
    SubSkillModule,
    JobModule,
    SkillModule,
    SubSkillModule,
    MappingJobSkillModule,
    PaymentMethodModule,
    TransactionModule,
    CoinModule,
    ProposalModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
