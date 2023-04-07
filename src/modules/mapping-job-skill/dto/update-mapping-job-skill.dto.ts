import { PartialType } from '@nestjs/swagger';
import { CreateMappingJobSkillDto } from './create-mapping-job-skill.dto';

export class UpdateMappingJobSkillDto extends PartialType(
  CreateMappingJobSkillDto,
) {}
