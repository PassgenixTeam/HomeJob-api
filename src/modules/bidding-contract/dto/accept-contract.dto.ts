import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AcceptBiddingContractDto {
  @ApiProperty({ type: String })
  @IsOptional()
  information: any;
}
