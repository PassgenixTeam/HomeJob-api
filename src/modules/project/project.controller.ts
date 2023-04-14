import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Auth, AuthUser } from '../../../libs/core/src';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateProjectDto, @AuthUser('id') userId: string) {
    return this.projectService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateProjectDto,
    @AuthUser('id') userId: string,
  ) {
    return this.projectService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.projectService.remove(id, userId);
  }
}
