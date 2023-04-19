import { Test, TestingModule } from '@nestjs/testing';
import { MappingUserSkillController } from './mapping-user-skill.controller';
import { MappingUserSkillService } from './mapping-user-skill.service';

describe('MappingUserSkillController', () => {
  let controller: MappingUserSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingUserSkillController],
      providers: [MappingUserSkillService],
    }).compile();

    controller = module.get<MappingUserSkillController>(
      MappingUserSkillController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
