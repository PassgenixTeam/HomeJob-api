import { EnumTransform, ROLE } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class RoleDto {
  @ApiProperty({ type: String, enum: ROLE })
  @IsEnum(ROLE)
  @EnumTransform(ROLE)
  role: ROLE;
}
