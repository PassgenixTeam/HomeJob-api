import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  ConfirmPaymentIntentDto,
  CreatePaymentIntentDto,
  StripeService,
} from '@app/payment';
import { UserEntity } from '../user/entities/user.entity';
import { PaymentIntentDto } from './dto/payment-intent.dto';
import { TYPE_PAYMENT_METHOD } from './enums/transaction.enum';
import { RedisService } from '../../../libs/core/src';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(TransactionService.name);

  create(
    queryRunner: QueryRunner,
    input: CreateTransactionDto,
    userId: string,
  ) {
    const { amount, paymentMethodId, description, freelancerId, refId, type } =
      input;

    const transaction = new TransactionEntity();
    transaction.amount = amount;
    transaction.paymentMethodId = paymentMethodId;
    transaction.description = description;
    transaction.refId = refId;
    transaction.type = type;
    transaction.createdBy = userId;

    return queryRunner.manager.save(transaction);
  }

  findAll(userId: string) {
    return this.transactionRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string, userId: string) {
    return this.transactionRepository.findOne({
      where: { id, createdBy: userId },
    });
  }

  createPaymentIntent(input: PaymentIntentDto, stripeCustomerId: string) {
    const { amount, description, paymentMethodId } = input;

    const paymentIntentInput: CreatePaymentIntentDto = {
      amount: amount * 100,
      currency: 'usd',
      description,
      paymentMethodId,
      customerId: stripeCustomerId,
      metadata: {
        // coin: amount,
      },
    };

    return this.stripeService.createPaymentIntent(paymentIntentInput);
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
      const transaction = await this.create(
        queryRunner,
        {
          amount: isExistPaymentIntent.amount,
          description: isExistPaymentIntent.description,
          paymentMethodId: isExistPaymentIntent.id,
          refId: confirmPaymentIntentDto.paymentIntentId,
          type: TYPE_PAYMENT_METHOD.STRIPE,
        },
        userId,
      );

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      user.balance += isExistPaymentIntent.amount;

      await queryRunner.manager
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          balance: user.balance,
        })
        .where('id = :id', { id: userId })
        .execute();

      await this.redisService.update(
        cacheId,
        JSON.stringify({
          ...user,
          balance: user.balance,
        }),
      );

      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new Error('Payment intent not confirmed');
    } finally {
      await queryRunner.release();
    }
  }
}
