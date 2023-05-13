import { Test, TestingModule } from '@nestjs/testing';
import { BiddingContractController } from './bidding-contract.controller';
import { BiddingContractService } from './bidding-contract.service';

describe('BiddingContractController', () => {
  let controller: BiddingContractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiddingContractController],
      providers: [BiddingContractService],
    }).compile();

    controller = module.get<BiddingContractController>(
      BiddingContractController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
