import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { StripeService } from '../../../libs/payment/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { JobEntity } from '../job/entities/job.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TransactionModule,
    TypeOrmModule.forFeature([ContractEntity, JobEntity, UserEntity]),
  ],
  controllers: [ContractController],
  providers: [ContractService, StripeService],
})
export class ContractModule {}
