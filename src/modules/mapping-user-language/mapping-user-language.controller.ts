import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MappingUserLanguageService } from './mapping-user-language.service';
import { CreateMappingUserLanguageDto } from './dto/create-mapping-user-language.dto';
import { UpdateMappingUserLanguageDto } from './dto/update-mapping-user-language.dto';
import { Auth, AuthUser } from '@app/core';
import { MultipleMappingUserLanguageDto } from './dto/multiple-mapping-user-language.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mapping-user-language')
@Controller('user-language')
export class MappingUserLanguageController {
  constructor(
    private readonly mappingUserLanguageService: MappingUserLanguageService,
  ) {}

  @Post()
  @Auth()
  create(
    @Body() input: CreateMappingUserLanguageDto,
    @AuthUser('id') userId: string,
  ) {
    return this.mappingUserLanguageService.create(input, userId);
  }

  @Get()
  findAll() {
    return this.mappingUserLanguageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mappingUserLanguageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateMappingUserLanguageDto,
    @AuthUser('id') userId: string,
  ) {
    return this.mappingUserLanguageService.update(id, input, userId);
  }

  @Patch('multiple')
  updateMultiple(
    @Body() input: MultipleMappingUserLanguageDto,
    @AuthUser('id') userId: string,
  ) {
    return this.mappingUserLanguageService.updateMultiple(input, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.mappingUserLanguageService.remove(id, userId);
  }
}
