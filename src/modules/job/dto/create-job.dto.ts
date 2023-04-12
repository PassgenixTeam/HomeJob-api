import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ type: String, description: 'Title' })
  title: string;

  @ApiProperty({ type: String, description: 'Subtitle' })
  subtitle: string;

  @ApiProperty({ type: String, description: 'Description' })
  description: string;

  @ApiProperty({ type: String, description: 'Scope Type' })
  scopeType: string;

  @ApiProperty({ type: String, description: 'Scope Level' })
  scopeLevel: string;

  @ApiProperty({ type: String, description: 'Scope Time' })
  scopeTime: string;

  @ApiProperty({ type: Number, description: 'Budget' })
  budget: number;

  @ApiProperty({ type: Number, description: 'Hourly To' })
  hourlyTo: number;

  @ApiProperty({ type: Number, description: 'Hourly From' })
  hourlyFrom: number;

  @ApiProperty({ type: [String], description: 'Attachments' })
  attachments: string[];

  @ApiProperty({ type: String, description: 'Status' })
  status: string;

  @ApiProperty({ type: [String] })
  skills: string[];
}
