import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntentDto {
  @ApiProperty({ type: String })
  paymentMethodId: string;

  @ApiProperty({ type: Number, description: 'Amount in coin' })
  amount: number;

  @ApiProperty({ type: String })
  description: string;
}
