import { Injectable, Logger } from '@nestjs/common';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { CoinPaymentIntentDto } from './dto/coin-payment-intent.dto';
import {
  ConfirmPaymentIntentDto,
  CreatePaymentIntentDto,
  StripeService,
} from '@app/payment';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinEntity } from './entities/coin.entity';
import { DataSource, Repository } from 'typeorm';
import { COIN_REASON, COIN_TITLE, COIN_TYPE } from './enums/coin.enum';
import { UserEntity } from '../user/entities/user.entity';
import { RedisService } from '../../../libs/core/src';

const coinList = {
  10: 1.5,
  20: 3,
  50: 7.5,
  100: 15,
  200: 30,
  500: 75,
  1000: 150,
};

@Injectable()
export class CoinService {
  private readonly logger = new Logger(CoinService.name);
  constructor(
    @InjectRepository(CoinEntity)
    private readonly coinRepository: Repository<CoinEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly stripeService: StripeService,
    private readonly redisService: RedisService,
    private dataSource: DataSource,
  ) {}

  createPaymentIntent(input: CoinPaymentIntentDto, stripeCustomerId: string) {
    const { amount, description, paymentMethodId } = input;

    const paymentIntentInput: CreatePaymentIntentDto = {
      amount: coinList[amount] * 100,
      currency: 'usd',
      description,
      paymentMethodId,
      customerId: stripeCustomerId,
      metadata: {
        coin: amount,
      },
    };

    return this.stripeService.createPaymentIntent(paymentIntentInput);
  }

  findAll(userId: string) {
    return this.coinRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} coin`;
  }

  getCoinList() {
    return coinList;
  }

  async confirmPaymentIntent(
    confirmPaymentIntentDto: ConfirmPaymentIntentDto,
    stripeCustomerId: string,
    userId: string,
    cacheId: string,
  ) {
    const isExistPaymentIntent = await this.stripeService.getPaymentIntent(
      confirmPaymentIntentDto.paymentIntentId,
    );

    if (
      !isExistPaymentIntent ||
      isExistPaymentIntent.customer !== stripeCustomerId
    ) {
      throw new Error('Payment intent does not exist');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create coin history
      const balanceCoin = await this.userRepository.findOne({
        where: { id: userId },
        select: ['coin'],
      });

      const coin = Number(isExistPaymentIntent.metadata.coin);
      const coinEntity = new CoinEntity();
      coinEntity.coin = coin;
      coinEntity.reason = COIN_REASON.DEPOSIT;
      coinEntity.type = COIN_TYPE.DEPOSIT;
      coinEntity.title = COIN_TITLE.DEPOSIT;
      coinEntity.balance = balanceCoin.coin + coin;
      coinEntity.user = {
        id: userId,
      } as any;

      await queryRunner.manager.save<CoinEntity>(coinEntity);

      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        confirmPaymentIntentDto,
      );

      if (paymentIntent.status === 'succeeded') {
        // update coin balance

        await queryRunner.manager.update(
          UserEntity,
          { id: userId },
          { coin: balanceCoin.coin + coin },
        );

        await this.redisService.del(cacheId);

        await queryRunner.commitTransaction();

        return 'Payment intent confirmed';
      }

      throw new Error('Payment intent not confirmed');
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new Error('Payment intent not confirmed');
    } finally {
      await queryRunner.release();
    }
  }
}