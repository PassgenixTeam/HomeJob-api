import { ApiProperty } from '@nestjs/swagger';

export class CreateMappingUserSkillDto {
  @ApiProperty({ type: String })
  skillId: string;
}
