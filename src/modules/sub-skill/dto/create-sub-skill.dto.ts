import { ApiProperty } from '@nestjs/swagger';

export class CreateSubSkillDto {
  @ApiProperty({ type: String, description: 'Name of the sub skill' })
  name: string;

  @ApiProperty({ type: String, description: 'Id of the skill' })
  skillId: string;
}
