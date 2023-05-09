import { Injectable, Logger } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProposalEntity } from './entities/proposal.entity';
import { DataSource, Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { FileQueue } from '../file/queues/file.queue';
import { UserEntity } from '../user/entities/user.entity';
import { RedisService } from '../../../libs/core/src';
import { CoinEntity } from '../coin/entities/coin.entity';
import { CoinService } from '../coin/coin.service';
import {
  differenceMultiArray,
  removeKeyUndefined,
} from '../../../libs/common/src';
import { FileEntity } from '../file/entities/file.entity';
import { JobEntity } from 'src/modules/job/entities/job.entity';
import { BiddingDto } from 'src/modules/proposal/dto/bidding.dto';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepository: Repository<ProposalEntity>,
    private readonly dataSource: DataSource,
    private readonly fileQueue: FileQueue,
    private readonly redisService: RedisService,
    private readonly coinService: CoinService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  private readonly logger = new Logger(ProposalService.name);

  async create(input: CreateProposalDto, user: UserEntity) {
    const job = await this.jobRepository.findOne({
      where: {
        id: input.jobId,
      },
      select: ['id'],
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proposalInstance = plainToInstance(ProposalEntity, input);

      proposalInstance.createdBy = user.id;
      proposalInstance.milestones = JSON.stringify(input.milestones);

      if (proposalInstance.attachments) {
        const attachments = await this.fileRepository
          .createQueryBuilder('file')
          .where('file.url IN (:...urls)', { urls: input.attachments })
          .getMany();

        proposalInstance.attachments = JSON.stringify(
          attachments.map((file) => {
            return {
              url: file.url,
              size: file.size,
            };
          }),
        );
      }

      const proposal = await queryRunner.manager.save<ProposalEntity>(
        proposalInstance,
      );

      if (proposalInstance.boostCoin && proposalInstance.boostCoin > 0) {
        await queryRunner.manager.update<UserEntity>(
          UserEntity,
          { id: user.id },
          {
            coin: user.coin + proposalInstance.boostCoin,
          },
        );

        await this.coinService.createCoinProposal(
          user,
          proposalInstance.boostCoin,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      // Job before commit transaction
      if (proposalInstance.attachments) {
        await this.fileQueue.updateFileUsing(input.attachments);
      }

      if (proposalInstance.boostCoin && proposalInstance.boostCoin > 0) {
        await this.redisService.update(
          user.cacheId,
          JSON.stringify({
            ...user,
            coin: user.coin + proposalInstance.boostCoin,
          }),
        );
      }

      return proposal;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async topBidding(jobId: string) {
    const topProposal = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('MAX(proposal.bidding)')
      .where('proposal.jobId = :jobId', { jobId })
      .getRawMany();

    const topBidding = topProposal ? topProposal[0]?.max : 0;

    return topBidding;
  }

  async bidding(id: string, input: BiddingDto, userId: string) {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
      },
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.createdBy !== userId) {
      throw new Error('You are owner of this proposal');
    }

    const topProposal = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('MAX(proposal.bidding)')
      .getRawMany();

    const topBidding = topProposal ? topProposal[0]?.max : 0;

    if (input.bidding <= topBidding) {
      throw new Error('Your bidding must be higher than top bidding');
    }

    await this.proposalRepository.update(id, {
      bidding: input.bidding,
    });

    return 'Bidding success';
  }

  async findAllByJob(jobId: string, userId: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
      },
      select: ['id'],
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return this.proposalRepository
      .createQueryBuilder('proposal')
      .leftJoinAndSelect('proposal.user', 'user')
      .where('proposal.jobId = :jobId', { jobId })
      .select([
        'proposal',
        'user.id',
        'user.avatarUrl',
        'user.firstName',
        'user.lastName',
      ])
      .orderBy('proposal.bidding', 'DESC')
      .getMany();
  }

  findAll(userId: string) {
    return this.proposalRepository
      .createQueryBuilder('proposal')
      .leftJoinAndSelect('proposal.user', 'user')
      .where('proposal.createdBy = :userId', { userId })
      .select([
        'proposal',
        'user.id',
        'user.avatarUrl',
        'user.firstName',
        'user.lastName',
      ])
      .getMany();
  }

  async findOne(id: string) {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
      },
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    return instanceToPlain(proposal);
  }

  async update(id: string, input: UpdateProposalDto, user: UserEntity) {
    let attachmentList1Only = [];
    let attachmentList2Only = [];

    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
      },
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.createdBy !== user.id) {
      throw new Error('You are not owner of this proposal');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proposalInstance = plainToInstance(ProposalEntity, input);

      proposalInstance.createdBy = user.id;
      proposalInstance.milestones = JSON.stringify(input.milestones);

      if (proposalInstance.attachments) {
        const { list1Only, common, list2Only } = differenceMultiArray(
          JSON.parse(proposal.attachments),
          input.attachments,
        );

        attachmentList1Only = list1Only;
        attachmentList2Only = list2Only;

        const attachments = await this.fileRepository
          .createQueryBuilder('file')
          .where('file.url IN (:...urls)', { urls: input.attachments })
          .getMany();

        proposalInstance.attachments = JSON.stringify(
          attachments.map((file) => {
            return {
              url: file.url,
              size: file.size,
            };
          }),
        );
      }

      removeKeyUndefined(proposalInstance);

      await queryRunner.manager
        .createQueryBuilder()
        .update(ProposalEntity)
        .set(proposalInstance)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      if (proposalInstance.boostCoin && proposalInstance.boostCoin > 0) {
        await queryRunner.manager.update<UserEntity>(
          UserEntity,
          { id: user.id },
          {
            coin: user.coin - proposalInstance.boostCoin,
          },
        );

        await this.coinService.createCoinProposal(
          user,
          proposalInstance.boostCoin,
          queryRunner,
        );
      }

      // Job before commit transaction
      if (proposalInstance.attachments) {
        Promise.all([
          this.fileQueue.updateFileUsing(attachmentList2Only),
          this.fileQueue.deleteFileUsing(attachmentList1Only),
        ]);
      }

      if (proposalInstance.boostCoin && proposalInstance.boostCoin > 0) {
        await this.redisService.update(
          user.cacheId,
          JSON.stringify({
            ...user,
            coin: user.coin - proposalInstance.boostCoin,
          }),
        );
      }

      await queryRunner.commitTransaction();

      return this.findOne(proposal.id);
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, userId: string) {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id,
      },
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.createdBy !== userId) {
      throw new Error('You are not owner of this proposal');
    }

    return this.proposalRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('createdBy = :userId', { userId })
      .execute();
  }
}
