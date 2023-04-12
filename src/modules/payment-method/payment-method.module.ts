import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { StripeService } from '../../../libs/payment/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity, UserEntity])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, StripeService, UserService],
})
export class PaymentMethodModule {}
