import { Test, TestingModule } from '@nestjs/testing';
import { EuenoService } from './eueno.service';

describe('EuenoService', () => {
  let service: EuenoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EuenoService],
    }).compile();

    service = module.get<EuenoService>(EuenoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
