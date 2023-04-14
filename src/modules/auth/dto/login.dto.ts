import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, example: 'abc@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: '123456' })
  password: string;
}
