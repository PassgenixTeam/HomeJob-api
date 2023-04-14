import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { LOGIN_BY } from '../../user/enums/user.enum';
import { EnumTransform } from '../../../../libs/common/src';

export class LoginSocialDto {
  @ApiProperty({ type: String, description: 'Token' })
  @IsString()
  token: string;

  @ApiProperty({ type: String, description: 'Login by' })
  @IsEnum(LOGIN_BY)
  @EnumTransform(LOGIN_BY)
  loginBy: LOGIN_BY;
}
