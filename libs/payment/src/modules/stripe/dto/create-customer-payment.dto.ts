import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerPaymentDto {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  state: string;

  @ApiProperty({ type: String })
  country: string;

  @ApiProperty({ type: String })
  line1: string;

  @ApiProperty({ type: String })
  line2: string;
}
