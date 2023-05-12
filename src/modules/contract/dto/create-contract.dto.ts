import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PAY_TYPE } from '../enums/contract.enum';
import { Type } from 'class-transformer';

export class MilestoneDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date, format: 'date' })
  dueDate: Date;

  @ApiProperty({ type: Number })
  amount: number;
}

class CompanyDto {
  @ApiProperty({ type: String })
  @IsString()
  country: string;

  @ApiProperty({ type: String })
  @IsString()
  address1: string;

  @ApiProperty({ type: String })
  @IsString()
  address2: string;

  @ApiProperty({ type: String })
  @IsString()
  city: string;

  @ApiProperty({ type: String })
  @IsString()
  state: string;

  @ApiProperty({ type: String })
  @IsString()
  zip: string;
}
export class CreateContractDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @IsNotEmpty()
  freelancerId: string;

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
  projectMilestones: MilestoneDto[];

  @ApiProperty({ type: Number })
  deposit: number;

  @ApiProperty({ type: CompanyDto })
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
