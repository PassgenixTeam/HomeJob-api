import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '@app/core';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateEducationDto, @AuthUser('id') userId: string) {
    return this.educationService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateEducationDto,
    @AuthUser('id') userId: string,
  ) {
    return this.educationService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.educationService.remove(id, userId);
  }
}
