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
import { ContractPaymentIntentDto } from './dto/contract-payment-intent.dto';
import {
  CONTRACT_STATUS,
  OFFER_STATUS,
  PAY_STATUS,
  PAY_TYPE,
} from './enums/contract.enum';
import { TransactionService } from '../transaction/transaction.service';
import { TYPE_PAYMENT_METHOD } from '../transaction/enums/transaction.enum';
import { JobEntity } from '../job/entities/job.entity';
import { plainToInstance } from 'class-transformer';
import { ProjectMilestoneEntity } from '../project-milestone/entities/project-milestone.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ROLE } from '../../../libs/common/src';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
    const contract = await this.getContract(input.contractId, userId);

    const deposit =
      contract.payType === PAY_TYPE.FIXED
        ? contract.payFixedPrice
        : // (JSON.stringify(contract.projectMilestones) as any as MilestoneDto)
          //     .amount;
          0;

    const fee = 0.5;
    const taxes = 0;
    const total = deposit + fee + taxes;

    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: total,
      currency: 'usd',
      customerId: stripeCustomerId,
      description: `Deposit for contract ${contract.contractId}`,
      metadata: {
        contractId: contract.contractId,
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

    if (contract.offerStatus !== OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer is not accepted');
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
        .set({ payStatus: PAY_STATUS.PAID, status: CONTRACT_STATUS.STARTED })
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

  /**
   * Accepts an offer with the specified ID for the given freelancer user.
   * @param id The ID of the offer to accept.
   * @param userId The ID of the freelancer user accepting the offer.
   * @returns A Promise that resolves to `true` if the offer was successfully accepted.
   * @throws If the offer is not found or has already been accepted.
   */
  async acceptOffer(id: string, userId: string) {
    const contract = await this.contractRepository.findOne({
      where: { id, freelancerId: userId },
    });

    if (!contract) {
      throw new Error('Offer not found');
    }

    if (contract.offerStatus === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted');
    }

    await this.contractRepository
      .createQueryBuilder()
      .update(ContractEntity)
      .set({
        offerStatus: OFFER_STATUS.ACCEPTED,
      })
      .where('id = :id', { id })
      .execute();

    return true;
  }

  /**
   * Accepts an offer with the specified ID for the given freelancer user.
   * @param id The ID of the offer to accept.
   * @param userId The ID of the freelancer user accepting the offer.
   * @returns A Promise that resolves to `true` if the offer was successfully accepted.
   * @throws If the offer is not found or has already been accepted.
   */
  async rejectOffer(id: string, userId: string) {
    const offer = await this.contractRepository.findOne({
      where: { id, freelancerId: userId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.offerStatus === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted');
    }

    await this.contractRepository
      .createQueryBuilder()
      .update(ContractEntity)
      .set({
        offerStatus: OFFER_STATUS.REJECTED,
      })
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async create(input: CreateContractDto, userId: string) {
    const { jobId, payType, dueDate, projectMilestones, freelancerId } = input;

    const freelancer = await this.userRepository.findOne({
      where: { id: freelancerId, role: ROLE.FREELANCE },
      select: ['id', 'stripeCustomerId'],
    });

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      select: ['id', 'createdBy'],
    });

    if (!job) {
      throw new Error('Job not found');
    }

    if (job.createdBy !== userId) {
      throw new Error('You are not the owner of this job');
    }

    const contractInstance = plainToInstance(ContractEntity, input);

    contractInstance.createdBy = userId;

    if (payType === 'FIXED_PRICE') {
      contractInstance.projectMilestones = null;
    } else {
      contractInstance.payFixedPrice = null;
    }

    if (dueDate) {
      contractInstance.dueDate = new Date(dueDate);
    }

    if (projectMilestones) {
      contractInstance.projectMilestones = plainToInstance(
        ProjectMilestoneEntity,
        projectMilestones,
      );
    }

    contractInstance.status = CONTRACT_STATUS.PENDING;

    const contract = await this.contractRepository.save(contractInstance);

    return contract;
  }

  findAll(userId: string) {
    return this.contractRepository.find({
      where: [
        {
          createdBy: userId,
        },
        {
          freelancerId: userId,
        },
      ],
    });
  }

  findOne(id: string, userId: string) {
    // return this.contractRepository.findOne({
    //   where: [
    //     {
    //       id,
    //       createdBy: userId,
    //     },
    //     {
    //       id,
    //       freelancerId: userId,
    //     },
    //   ],
    // });

    return this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.projectMilestones', 'projectMilestones')
      .where(' id = :id AND (createdBy = :userId OR freelancerId = :userId)', {
        id,
        userId,
      })
      .getOne();
  }

  update(id: string, updateContractDto: UpdateContractDto, userId: string) {
    return `This action updates a #${id} contract`;
  }

  remove(id: string, userId: string) {
    // return `This action removes a #${id} contract`;
  }

  private async getContract(contractId: string, userId: string) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
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

    if (contract.offerStatus !== OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer is not accepted');
    }

    return contract;
  }
}
