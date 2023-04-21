import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectMilestoneService } from './project-milestone.service';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { Auth, AuthUser } from '@app/core';

@Controller('project-milestone')
export class ProjectMilestoneController {
  constructor(
    private readonly projectMilestoneService: ProjectMilestoneService,
  ) {}

  @Post()
  @Auth()
  create(
    @Body() input: CreateProjectMilestoneDto,
    @AuthUser('id') userId: string,
  ) {
    return this.projectMilestoneService.create(input, userId);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateProjectMilestoneDto,
    @AuthUser('id') userId: string,
  ) {
    return this.projectMilestoneService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.projectMilestoneService.remove(id, userId);
  }
}
