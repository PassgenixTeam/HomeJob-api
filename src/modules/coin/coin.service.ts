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
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { COIN_REASON, COIN_TITLE, COIN_TYPE } from './enums/coin.enum';
import { UserEntity } from '../user/entities/user.entity';
import { RedisService } from '../../../libs/core/src';
import { plainToInstance } from 'class-transformer';

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
      stripeCustomerId,
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create coin history
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      const coin = Number(isExistPaymentIntent.metadata.coin);
      const coinEntity = new CoinEntity();
      coinEntity.coin = coin;
      coinEntity.reason = COIN_REASON.DEPOSIT;
      coinEntity.type = COIN_TYPE.DEPOSIT;
      coinEntity.title = COIN_TITLE.DEPOSIT;
      coinEntity.balance = user.coin + coin;
      coinEntity.user = {
        id: userId,
      } as any;

      await queryRunner.manager.save<CoinEntity>(coinEntity);

      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        confirmPaymentIntentDto,
      );

      // update coin balance
      await queryRunner.manager.update(
        UserEntity,
        { id: userId },
        { coin: user.coin + coin },
      );

      await this.redisService.update(
        cacheId,
        JSON.stringify({
          ...user,
          coin: user.coin + coin,
        }),
      );

      await queryRunner.commitTransaction();

      return 'Payment intent confirmed';
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new Error('Payment intent not confirmed');
    } finally {
      await queryRunner.release();
    }
  }

  createCoinProposal(user: UserEntity, coin: number, queryRunner: QueryRunner) {
    return queryRunner.manager.save<CoinEntity>(
      plainToInstance(CoinEntity, {
        coin: -coin,
        reason: COIN_REASON.COIN_BOOST_PROPOSAL,
        type: COIN_TYPE.COIN_BOOST_PROPOSAL,
        title: COIN_TITLE.COIN_BOOST_PROPOSAL,
        balance: user.coin - coin,
        user: { id: user.id } as any,
      }),
    );
  }
}
