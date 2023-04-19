import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MappingUserSkillService } from './mapping-user-skill.service';
import { CreateMappingUserSkillDto } from './dto/create-mapping-user-skill.dto';
import { UpdateMappingUserSkillDto } from './dto/update-mapping-user-skill.dto';
import { Auth, AuthUser } from '../../../libs/core/src';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mapping-user-skill')
@Controller('user-skill')
export class MappingUserSkillController {
  constructor(
    private readonly mappingUserSkillService: MappingUserSkillService,
  ) {}

  @Post()
  @Auth()
  create(
    @Body() input: CreateMappingUserSkillDto,
    @AuthUser('id') userId: string,
  ) {
    return this.mappingUserSkillService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.mappingUserSkillService.findAll();
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.mappingUserSkillService.remove(id, userId);
  }
}
