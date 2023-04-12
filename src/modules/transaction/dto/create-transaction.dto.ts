import { ApiProperty } from '@nestjs/swagger';
import { TYPE_PAYMENT_METHOD } from '../enums/transaction.enum';

export class CreateTransactionDto {
  @ApiProperty({ type: String, enum: TYPE_PAYMENT_METHOD })
  type: TYPE_PAYMENT_METHOD;

  @ApiProperty({ type: String })
  refId: string;

  @ApiProperty({ type: String })
  amount: number;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  paymentMethodId: string;

  @ApiProperty({ type: String })
  freelancerId: string;
}
