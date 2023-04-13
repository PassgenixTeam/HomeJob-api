import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ type: String, example: 'abc@gmail.com' })
  email: string;

  @ApiProperty({ type: String, example: '123456' })
  password: string;

  @ApiProperty({ type: String, example: 'John' })
  firstName: string;

  @ApiProperty({ type: String, example: 'Wick' })
  lastName: string;

  @ApiProperty({ type: String, example: 'Viet Nam' })
  country: string;
}
