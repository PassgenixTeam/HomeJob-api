import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodsDto {
  @ApiProperty({ type: String })
  customerId: string;

  @ApiProperty({ type: String })
  token: string;
}
