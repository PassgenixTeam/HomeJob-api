import { ApiProperty } from '@nestjs/swagger';

export class ContractPaymentIntentDto {
  @ApiProperty({ type: String, format: 'uuid' })
  contractId: string;

  @ApiProperty({ type: String })
  paymentMethodId: string;

  @ApiProperty({ type: Number, description: 'Amount in coin' })
  amount: number;

  @ApiProperty({ type: String })
  description: string;
}
