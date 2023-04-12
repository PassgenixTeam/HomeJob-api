import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Auth, AuthUser } from '@app/core';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @Auth()
  create(@Body() createJobDto: CreateJobDto, @AuthUser('id') userId: string) {
    return this.jobService.create(userId, createJobDto);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @AuthUser('id') userId: string,
  ) {
    return this.jobService.update(id, updateJobDto, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.jobService.remove(id, userId);
  }
}
