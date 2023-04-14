import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmploymentService } from './employment.service';
import { CreateEmploymentDto } from './dto/create-employment.dto';
import { UpdateEmploymentDto } from './dto/update-employment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../../libs/core/src';

@ApiTags('Employment')
@Controller('employment')
export class EmploymentController {
  constructor(private readonly employmentService: EmploymentService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateEmploymentDto, @AuthUser('id') userId: string) {
    return this.employmentService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.employmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employmentService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateEmploymentDto,
    @AuthUser('id') userId: string,
  ) {
    return this.employmentService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.employmentService.remove(id, userId);
  }
}
