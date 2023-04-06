import { Test, TestingModule } from '@nestjs/testing';
import { SubSkillController } from './sub-skill.controller';
import { SubSkillService } from './sub-skill.service';

describe('SubSkillController', () => {
  let controller: SubSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubSkillController],
      providers: [SubSkillService],
    }).compile();

    controller = module.get<SubSkillController>(SubSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
