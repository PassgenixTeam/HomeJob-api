import { Test, TestingModule } from '@nestjs/testing';
import { EuenoController } from './eueno.controller';
import { EuenoService } from './eueno.service';

describe('EuenoController', () => {
  let controller: EuenoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EuenoController],
      providers: [EuenoService],
    }).compile();

    controller = module.get<EuenoController>(EuenoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
