import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateProjectMilestoneDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ type: String, format: 'uuid' })
  contractId: string;
}
