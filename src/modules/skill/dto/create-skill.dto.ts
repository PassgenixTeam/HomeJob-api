import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ type: String, description: 'Name of the skill' })
  name: string;
}
