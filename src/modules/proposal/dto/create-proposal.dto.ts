import { EnumTransform } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { PAID_TYPE } from 'src/modules/proposal/enums/proposal.enum';

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

  @ApiProperty({ type: String, enum: PAID_TYPE })
  @IsEnum(PAID_TYPE)
  @EnumTransform(PAID_TYPE)
  paidType: PAID_TYPE;

  @ApiProperty({ type: Number })
  amount: number;

  @ApiProperty({ type: Number })
  bid: number;

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

  @ApiProperty({ type: Number })
  bidding = 0;

  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  estimatedTime: number;

  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  estimatedLabor: number;

  @ApiProperty({ type: Number, default: 0 })
  @IsNumber()
  estimateBudget: number;

  @ApiProperty({ type: String })
  oraiProject: string;
}
