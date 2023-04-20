import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentIntentDto {
  @ApiProperty({ type: String })
  paymentIntentId: string;

  @ApiProperty({ type: String })
  data?: string;
}
