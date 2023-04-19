import { Test, TestingModule } from '@nestjs/testing';
import { MappingUserSkillService } from './mapping-user-skill.service';

describe('MappingUserSkillService', () => {
  let service: MappingUserSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingUserSkillService],
    }).compile();

    service = module.get<MappingUserSkillService>(MappingUserSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
