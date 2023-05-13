import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AcceptBiddingContractDto {
  @ApiProperty({ type: String })
  @IsOptional()
  approvedTxHash: string;
}
