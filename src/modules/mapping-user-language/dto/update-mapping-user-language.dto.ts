import { PartialType } from '@nestjs/swagger';
import { CreateMappingUserLanguageDto } from './create-mapping-user-language.dto';

export class UpdateMappingUserLanguageDto extends PartialType(
  CreateMappingUserLanguageDto,
) {}
