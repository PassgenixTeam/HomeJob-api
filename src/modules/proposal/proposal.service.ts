import { Injectable, Logger } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProposalEntity } from './entities/proposal.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FileQueue } from '../file/queues/file.queue';
import { UserEntity } from '../user/entities/user.entity';
import { RedisService } from '../../../libs/core/src';
import { CoinEntity } from '../coin/entities/coin.entity';
import { CoinService } from '../coin/coin.service';
import {
  differenceMultiArray,
  removeKeyUndefined,
} from '../../../libs/common/src';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepository: Repository<ProposalEntity>,
    private readonly dataSource: DataSource,
    private readonly fileQueue: FileQueue,
    private readonly redisService: RedisService,
    private readonly coinService: CoinService,
  ) {}

  private readonly logger = new Logger(ProposalService.name);

  async create(input: CreateProposalDto, user: UserEntity) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proposalInstance = plainToInstance(ProposalEntity, input);

      proposalInstance.createdBy = user.id;
      proposalInstance.milestones = JSON.stringify(input.milestones);

      if (proposalInstance.attachments) {
        proposalInstance.attachments = JSON.stringify(input.attachments);
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

  findOne(id: string) {
    return this.proposalRepository.findOne({
      where: {
        id,
      },
    });
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

        proposalInstance.attachments = JSON.stringify(input.attachments);
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
