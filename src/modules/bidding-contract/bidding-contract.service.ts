import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AcceptBiddingContractDto } from 'src/modules/bidding-contract/dto/accept-contract.dto';
import { AddSmartContract } from 'src/modules/bidding-contract/dto/add-smart-contract.dto';
import { BiddingContractEntity } from 'src/modules/bidding-contract/entities/bidding-contract.entity';
import { BIDDING_CONTRACT_STATUS } from 'src/modules/bidding-contract/enum/bidding-contract.enum';
import { JobEntity } from 'src/modules/job/entities/job.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBiddingContractDto } from './dto/create-bidding-contract.dto';

@Injectable()
export class BiddingContractService {
  constructor(
    @InjectRepository(BiddingContractEntity)
    private biddingContractRepository: Repository<BiddingContractEntity>,
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async create(
    createBiddingContractDto: CreateBiddingContractDto,
    ownerId: string,
  ) {
    const biddingContractInstance = plainToInstance(
      BiddingContractEntity,
      createBiddingContractDto,
    );

    const job = await this.jobRepository.findOne({
      where: {
        id: createBiddingContractDto.jobId,
      },
      select: ['id'],
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const contractor = await this.userRepository.findOne({
      where: {
        id: createBiddingContractDto.contractorId,
      },
      select: ['id'],
    });

    if (!contractor) {
      throw new Error('Contractor not found');
    }

    biddingContractInstance.ownerId = ownerId;

    biddingContractInstance.status = BIDDING_CONTRACT_STATUS.PENDING;

    await this.biddingContractRepository.save(biddingContractInstance);
    return biddingContractInstance;
  }

  async addSmartContract(
    id: string,
    addSmartContract: AddSmartContract,
    userId: string,
  ) {
    const biddingContract = await this.biddingContractRepository.findOne({
      where: {
        id,
      },
      select: ['id'],
    });

    if (!biddingContract) {
      throw new Error('Contract not found');
    }

    await this.biddingContractRepository.update(id, {
      txHash: addSmartContract.txHash,
      oraiJobId: addSmartContract.oraiJobId,
    });

    return biddingContract;
  }

  async findAll(userId: string) {
    const [biddingContract, total] = await this.biddingContractRepository
      .createQueryBuilder('biddingContract')
      .leftJoinAndSelect('biddingContract.job', 'job')
      .leftJoinAndSelect('biddingContract.contractor', 'contractor')
      .leftJoinAndSelect('biddingContract.owner', 'owner')
      .where('biddingContract.contractorId = :userId', { userId })
      .orWhere('biddingContract.ownerId = :userId', { userId })
      .getManyAndCount();

    return biddingContract;
  }

  async findOne(id: string) {
    const contract = await this.biddingContractRepository
      .createQueryBuilder('biddingContract')
      .leftJoinAndSelect('biddingContract.job', 'job')
      .leftJoinAndSelect('biddingContract.contractor', 'contractor')
      .leftJoinAndSelect('biddingContract.owner', 'owner')
      .where('biddingContract.id = :id', { id })
      .getOne();

    return instanceToPlain(contract);
  }

  async acceptContract(
    id: string,
    userId: string,
    acceptContractDto: AcceptBiddingContractDto,
  ) {
    const contract = await this.biddingContractRepository
      .createQueryBuilder('biddingContract')
      .where('biddingContract.id = :id', { id })
      .getOne();

    if (!contract) {
      throw new Error('Contract not found');
    }

    if (contract.contractorId !== userId) {
      throw new Error('You are not contractor of this contract');
    }

    contract.approvedTxHash = acceptContractDto.approvedTxHash;
    contract.status = BIDDING_CONTRACT_STATUS.ACCEPTED;

    await this.biddingContractRepository.save(contract);

    return 'Contract accepted';
  }
}
