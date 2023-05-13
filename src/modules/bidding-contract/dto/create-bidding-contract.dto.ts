import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBiddingContractDto {
  @ApiProperty({ type: String, description: 'Job Id' })
  @IsString()
  jobId: string;

  @ApiProperty({ type: String, format: 'uuid', description: 'Contractor Id' })
  @IsString()
  contractorId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  information: any;
}
