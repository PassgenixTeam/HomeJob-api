import { Injectable, Logger } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { DataSource, Repository } from 'typeorm';
import {
  ConfirmPaymentIntentDto,
  StripeService,
} from '../../../libs/payment/src';
import { OfferEntity } from '../offer/entities/offer.entity';
import { ContractPaymentIntentDto } from './dto/contract-payment-intent.dto';
import { OFFER_STATUS, PAY_TYPE } from '../offer/enums/offer.enum';
import { MilestoneDto } from '../proposal/dto/create-proposal.dto';
import { PAY_STATUS } from './enums/contract.enum';
import { TransactionService } from '../transaction/transaction.service';
import { TYPE_PAYMENT_METHOD } from '../transaction/enums/transaction.enum';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
    private readonly transactionService: TransactionService,
  ) {}

  private readonly logger = new Logger(ContractService.name);

  async createPaymentIntent(
    input: ContractPaymentIntentDto,
    stripeCustomerId: string,
    userId: string,
  ) {
    const offer = await this.offerRepository.findOne({
      where: { id: input.contractId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.createdBy !== userId) {
      throw new Error('You are not the owner of this offer');
    }

    if (offer.status !== OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer is not accepted');
    }

    const deposit =
      offer.payType === PAY_TYPE.FIXED
        ? offer.payFixedPrice
        : (JSON.stringify(offer.projectMilestones) as any as MilestoneDto)
            .amount;

    const fee = 0.5;
    const taxes = 0;
    const total = deposit + fee + taxes;

    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: total,
      currency: 'usd',
      customerId: stripeCustomerId,
      description: `Deposit for offer ${offer.id}`,
      metadata: {
        contractId: offer.contractId,
      },
      paymentMethodId: input.paymentMethodId,
    });

    return paymentIntent;
  }

  async confirmPaymentIntent(
    input: ConfirmPaymentIntentDto,
    stripeCustomerId: string,
    userId: string,
    cacheId: string,
  ): Promise<any> {
    const { paymentIntentId } = input;

    const paymentIntent = await this.stripeService.getPaymentIntent(
      paymentIntentId,
      stripeCustomerId,
    );

    const contract = await this.contractRepository.findOne({
      where: { id: paymentIntent['metadata']['contractId'] },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    if (contract.createdBy !== userId) {
      throw new Error('You are not the owner of this contract');
    }

    if (contract.payStatus === PAY_STATUS.PAID) {
      throw new Error('Contract is already paid');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedContract = await queryRunner.manager
        .createQueryBuilder()
        .update(ContractEntity)
        .set({ payStatus: PAY_STATUS.PAID })
        .where('id = :id', { id: contract.id })
        .execute();

      if (
        !updatedContract ||
        !updatedContract.affected ||
        updatedContract.affected < 1
      ) {
        throw new Error('Error updating offer');
      }

      await Promise.all([
        // Deposit to account
        this.transactionService.create(
          queryRunner,
          {
            amount: contract.total,
            description: 'Deposits to account',
            type: TYPE_PAYMENT_METHOD.STRIPE,
            paymentMethodId: paymentIntent['payment_method'].toString(),
            refId: paymentIntent.id,
          },
          userId,
          cacheId,
        ),
        // Deposit for offer
        this.transactionService.create(
          queryRunner,
          {
            amount: -contract.total,
            description: `Deposit for contract ${contract.id}`,
            type: TYPE_PAYMENT_METHOD.STRIPE,
            paymentMethodId: paymentIntent['payment_method'].toString(),
            refId: paymentIntent.id,
          },
          userId,
          cacheId,
        ),
      ]);

      await this.stripeService.confirmPaymentIntent({ paymentIntentId });

      await queryRunner.commitTransaction();

      return 'Payment intent confirmed';
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  create(input: CreateContractDto) {
    return 'This action adds a new contract';
  }

  findAll() {
    return `This action returns all contract`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
