import { Test, TestingModule } from '@nestjs/testing';
import { MappingUserLanguageService } from './mapping-user-language.service';

describe('MappingUserLanguageService', () => {
  let service: MappingUserLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingUserLanguageService],
    }).compile();

    service = module.get<MappingUserLanguageService>(
      MappingUserLanguageService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
