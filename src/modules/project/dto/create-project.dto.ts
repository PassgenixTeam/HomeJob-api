import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  completedDate: string;

  @ApiProperty({ type: String })
  template: string;

  @ApiProperty({ type: [String] })
  attachments: string[];

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  description: string;
}
