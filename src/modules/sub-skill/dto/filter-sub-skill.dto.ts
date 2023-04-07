import { ApiProperty } from '@nestjs/swagger';

export class FilterSubSkillDto {
  @ApiProperty({ type: String, description: 'Name', required: false })
  name: string;

  @ApiProperty({ type: String, description: 'Skill Id', required: false })
  skillId: string;
}
