import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceDto {
  @ApiProperty({ type: String })
  subject: string;

  @ApiProperty({ type: String })
  description: string;
}
