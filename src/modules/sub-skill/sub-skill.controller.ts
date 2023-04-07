import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubSkillService } from './sub-skill.service';
import { CreateSubSkillDto } from './dto/create-sub-skill.dto';
import { UpdateSubSkillDto } from './dto/update-sub-skill.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterSubSkillDto } from './dto/filter-sub-skill.dto';

@ApiTags('sub-skill')
@Controller('sub-skill')
export class SubSkillController {
  constructor(private readonly subSkillService: SubSkillService) {}

  @Post()
  create(@Body() input: CreateSubSkillDto) {
    return this.subSkillService.create(input);
  }

  @Get()
  findAll(@Query() filter: FilterSubSkillDto) {
    return this.subSkillService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subSkillService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubSkillDto: UpdateSubSkillDto,
  ) {
    return this.subSkillService.update(id, updateSubSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subSkillService.remove(id);
  }
}
