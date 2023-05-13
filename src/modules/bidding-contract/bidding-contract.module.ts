import { Module } from '@nestjs/common';
import { BiddingContractService } from './bidding-contract.service';
import { BiddingContractController } from './bidding-contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingContractEntity } from 'src/modules/bidding-contract/entities/bidding-contract.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { JobEntity } from 'src/modules/job/entities/job.entity';
import { ProposalEntity } from 'src/modules/proposal/entities/proposal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BiddingContractEntity,
      JobEntity,
      UserEntity,
      ProposalEntity,
    ]),
  ],
  controllers: [BiddingContractController],
  providers: [BiddingContractService],
})
export class BiddingContractModule {}
