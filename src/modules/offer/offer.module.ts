import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { JobEntity } from '../job/entities/job.entity';
import { StripeService } from '../../../libs/payment/src';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TransactionModule,
    TypeOrmModule.forFeature([OfferEntity, JobEntity]),
  ],
  controllers: [OfferController],
  providers: [OfferService, StripeService],
})
export class OfferModule {}
