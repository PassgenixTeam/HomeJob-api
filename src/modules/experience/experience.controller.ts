import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Auth, AuthUser } from '@app/core';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateExperienceDto, @AuthUser('id') userId: string) {
    return this.experienceService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateExperienceDto,
    @AuthUser('id') userId: string,
  ) {
    return this.experienceService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.experienceService.remove(id, userId);
  }
}
