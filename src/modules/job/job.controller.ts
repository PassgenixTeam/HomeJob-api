import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Auth, AuthUser } from '@app/core';
import { ApiTags } from '@nestjs/swagger';
import { Pagination, PaginationOptions } from '@app/common';
import { QueryMyJobDto } from 'src/modules/job/dto/query-my-job.dto';

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

  @Get('my-jobs')
  @Auth()
  myJob(
    @Pagination() pagination: PaginationOptions,
    @Query() query: QueryMyJobDto,
    @AuthUser('id') userId: string,
  ) {
    return this.jobService.myJob(pagination, query, userId);
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
