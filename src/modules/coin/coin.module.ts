import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { StripeService } from '@app/payment';
import { CoinEntity } from './entities/coin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoinEntity, UserEntity])],
  controllers: [CoinController],
  providers: [CoinService, StripeService],
})
export class CoinModule {}
