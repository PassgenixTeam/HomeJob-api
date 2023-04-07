import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StripeModule } from '@app/payment';
import { PaypalModule } from '../../libs/payment/src/modules/paypal/paypal.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { JobModule } from './job/job.module';
import { SkillModule } from './skill/skill.module';
import { SubSkillModule } from './sub-skill/sub-skill.module';
import { MappingJobSkillModule } from './mapping-job-skill/mapping-job-skill.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    StripeModule,
    PaypalModule,
    UploadModule,
    JobModule,
    SkillModule,
    SubSkillModule,
    MappingJobSkillModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
