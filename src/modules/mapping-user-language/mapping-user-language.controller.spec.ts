import { Test, TestingModule } from '@nestjs/testing';
import { MappingUserLanguageController } from './mapping-user-language.controller';
import { MappingUserLanguageService } from './mapping-user-language.service';

describe('MappingUserLanguageController', () => {
  let controller: MappingUserLanguageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingUserLanguageController],
      providers: [MappingUserLanguageService],
    }).compile();

    controller = module.get<MappingUserLanguageController>(
      MappingUserLanguageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
