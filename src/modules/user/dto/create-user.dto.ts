import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String })
  avatarUrl: string;

  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @ApiProperty({ type: String })
  role: string;

  @ApiProperty({ type: String })
  stripeCustomerId: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  country: string;

  @ApiProperty({ type: String })
  line1: string;

  @ApiProperty({ type: String })
  line2: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  state: string;
}
