import { Injectable, Logger } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferEntity } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '../job/entities/job.entity';
import { plainToInstance } from 'class-transformer';
import { OFFER_STATUS } from './enums/offer.enum';
import { StripeService } from '@app/payment';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
    private readonly transactionService: TransactionService,
  ) {}

  private readonly logger = new Logger(OfferService.name);

  async create(input: CreateOfferDto, userId: string) {
    const { jobId, payType, dueDate, projectMilestones, deposit } = input;

    const job = await this.jobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const offerInstance = plainToInstance(OfferEntity, input);

    offerInstance.createdBy = userId;

    if (payType === 'FIXED_PRICE') {
      offerInstance.projectMilestones = null;
    } else {
      offerInstance.payFixedPrice = null;
    }

    if (dueDate) {
      offerInstance.dueDate = new Date(dueDate);
    }

    if (projectMilestones) {
      offerInstance.projectMilestones = JSON.stringify(projectMilestones);
    }

    offerInstance.status = OFFER_STATUS.PENDING;

    const offer = await this.offerRepository.save(offerInstance);

    return offer;
  }

  findAll(userId: string) {
    return this.offerRepository.find({
      where: [{ createdBy: userId }, { freelancerId: userId }],
    });
  }

  findOne(id: string, userId: string) {
    return this.offerRepository.findOne({
      where: [
        { id, createdBy: userId },
        { id, freelancerId: userId },
      ],
    });
  }

  async update(id: string, input: UpdateOfferDto, userId: string) {
    const offer = await this.offerRepository.findOne({
      where: { id, createdBy: userId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.status === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted');
    }
  }

  async acceptOffer(id: string, userId: string) {
    const offer = await this.offerRepository.findOne({
      where: { id, freelancerId: userId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.status === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted');
    }

    await this.offerRepository
      .createQueryBuilder()
      .update(OfferEntity)
      .set({
        status: OFFER_STATUS.ACCEPTED,
      })
      .where('id = :id', { id })
      .execute();

    // Sau khi accepted thì tạo contract

    return true;
  }

  async rejectOffer(id: string, userId: string) {
    const offer = await this.offerRepository.findOne({
      where: { id, freelancerId: userId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.status === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted');
    }

    await this.offerRepository

      .createQueryBuilder()
      .update(OfferEntity)
      .set({
        status: OFFER_STATUS.REJECTED,
      })
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async remove(id: string, userId: string) {
    const offer = await this.offerRepository.findOne({
      where: { id, createdBy: userId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.status === OFFER_STATUS.ACCEPTED) {
      throw new Error('Offer already accepted and cannot be deleted');
    }

    return this.offerRepository
      .createQueryBuilder()
      .delete()
      .from(OfferEntity)
      .where('id = :id', { id })
      .andWhere('createdBy = :userId', { userId })
      .execute();
  }
}
