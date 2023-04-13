import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEmail, ValidateNested } from 'class-validator';

export class MilestoneDto {
  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date, format: 'date' })
  dueDate: Date;

  @ApiProperty({ type: Number })
  amount: number;
}

export class CreateProposalDto {
  @ApiProperty()
  jobId: string;

  @ApiProperty()
  paidType: string;

  @ApiProperty({ type: Number })
  amount: number;

  @ApiProperty({ type: [MilestoneDto] })
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  milestones: MilestoneDto[];

  @ApiProperty()
  projectLong: string;

  @ApiProperty()
  coverLetter: string;

  @ApiProperty({ type: [String] })
  attachments: string[];

  @ApiProperty({ type: Number })
  boostCoin: number;

  @ApiProperty({ type: Date, format: 'date' })
  @IsDateString()
  boostTime: Date;
}
