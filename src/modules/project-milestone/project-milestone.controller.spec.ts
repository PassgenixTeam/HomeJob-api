import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMilestoneController } from './project-milestone.controller';
import { ProjectMilestoneService } from './project-milestone.service';

describe('ProjectMilestoneController', () => {
  let controller: ProjectMilestoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectMilestoneController],
      providers: [ProjectMilestoneService],
    }).compile();

    controller = module.get<ProjectMilestoneController>(
      ProjectMilestoneController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
