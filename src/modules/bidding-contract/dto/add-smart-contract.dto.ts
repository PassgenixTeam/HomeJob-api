import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddSmartContract {
  @ApiProperty({ type: String, description: 'txHash' })
  @IsString()
  txHash: string;

  @ApiProperty({ type: String, description: 'oraiJobId' })
  @IsString()
  oraiJobId: string;
}
