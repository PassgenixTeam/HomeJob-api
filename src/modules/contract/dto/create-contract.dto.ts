import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, ValidateNested } from 'class-validator';
import { PAY_TYPE } from '../enums/contract.enum';
import { Type } from 'class-transformer';

export class MilestoneDto {
  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date, format: 'date' })
  dueDate: Date;

  @ApiProperty({ type: Number })
  amount: number;
}

export class CreateContractDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ type: String, enum: PAY_TYPE })
  @IsNotEmpty()
  payType: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ type: Number })
  payFixedPrice: number;

  @ApiProperty({ type: MilestoneDto })
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  projectMilestones: MilestoneDto;

  @ApiProperty({ type: Number })
  deposit: number;
}
