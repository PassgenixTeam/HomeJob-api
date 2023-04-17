import { ValidateNested } from 'class-validator';
import { CreateMappingUserLanguageDto } from './create-mapping-user-language.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MultipleMappingUserLanguageDto {
  @ApiProperty({ type: [CreateMappingUserLanguageDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateMappingUserLanguageDto)
  mappingUserLanguages: CreateMappingUserLanguageDto[];
}
