import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubSkillService } from './sub-skill.service';
import { CreateSubSkillDto } from './dto/create-sub-skill.dto';
import { UpdateSubSkillDto } from './dto/update-sub-skill.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sub-skill')
@Controller('sub-skill')
export class SubSkillController {
  constructor(private readonly subSkillService: SubSkillService) {}

  @Post()
  create(@Body() createSubSkillDto: CreateSubSkillDto) {
    return this.subSkillService.create(createSubSkillDto);
  }

  @Get()
  findAll() {
    return this.subSkillService.findAll();
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
