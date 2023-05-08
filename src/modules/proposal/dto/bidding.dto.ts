import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class BiddingDto {
  @ApiProperty({ type: Number, example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  bidding: number;
}
