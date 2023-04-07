import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDto {
  @ApiProperty({ type: Boolean })
  isDefault: boolean;

  @ApiProperty({ type: String })
  token: string;
}
