import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({ type: String })
  school: string;

  @ApiProperty({ type: String })
  degree: string;

  @ApiProperty({ type: String })
  fromAttended: string;

  @ApiProperty({ type: String })
  toAttended: string;

  @ApiProperty({ type: String })
  areaOfStudy: string;

  @ApiProperty({ type: String })
  description: string;
}
