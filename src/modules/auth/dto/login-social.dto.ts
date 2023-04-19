import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { LOGIN_BY } from '../../user/enums/user.enum';
import { EnumTransform } from '../../../../libs/common/src';

export class LoginSocialDto {
  @ApiProperty({ type: String, description: 'Token' })
  @IsString()
  token: string;
}
