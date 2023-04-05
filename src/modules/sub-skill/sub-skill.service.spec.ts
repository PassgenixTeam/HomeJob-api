import { Test, TestingModule } from '@nestjs/testing';
import { SubSkillService } from './sub-skill.service';

describe('SubSkillService', () => {
  let service: SubSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubSkillService],
    }).compile();

    service = module.get<SubSkillService>(SubSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
