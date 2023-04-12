import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ type: String })
  customerId: string;

  @ApiProperty({ type: String })
  paymentMethodId: string;

  @ApiProperty({ type: String })
  currency = 'usd';

  @ApiProperty({ type: Number })
  amount = 1;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Object })
  metadata: Record<string, any> = {};
}
