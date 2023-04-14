import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginSocialDto {
  @ApiProperty({ type: String, description: 'Token' })
  @IsString()
  token: string;
}
