import { Test, TestingModule } from '@nestjs/testing';
import { MappingJobSkillService } from './mapping-job-skill.service';

describe('MappingJobSkillService', () => {
  let service: MappingJobSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingJobSkillService],
    }).compile();

    service = module.get<MappingJobSkillService>(MappingJobSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
