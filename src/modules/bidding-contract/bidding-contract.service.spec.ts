import { Test, TestingModule } from '@nestjs/testing';
import { BiddingContractService } from './bidding-contract.service';

describe('BiddingContractService', () => {
  let service: BiddingContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiddingContractService],
    }).compile();

    service = module.get<BiddingContractService>(BiddingContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
