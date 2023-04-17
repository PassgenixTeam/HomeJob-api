import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { LANGUAGE_LEVEL } from '../enums/mapping-user-language.enum';
import { EnumTransform } from '../../../../libs/common/src';

export class CreateMappingUserLanguageDto {
  @ApiProperty()
  @IsString()
  languageId: string;

  @ApiProperty()
  @IsEnum(LANGUAGE_LEVEL)
  @EnumTransform(LANGUAGE_LEVEL)
  level: string;
}
