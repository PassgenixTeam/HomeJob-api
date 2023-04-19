import { PartialType } from '@nestjs/swagger';
import { CreateMappingUserSkillDto } from './create-mapping-user-skill.dto';

export class UpdateMappingUserSkillDto extends PartialType(
  CreateMappingUserSkillDto,
) {}
