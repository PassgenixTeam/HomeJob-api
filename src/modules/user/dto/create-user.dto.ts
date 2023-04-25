import { EnumTransform } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { HOURS_PER_WEEK } from 'src/modules/user/enums/user.enum';

export class VideoOverview {
  @ApiProperty({ type: String })
  @Expose()
  url: string;

  @ApiProperty({ type: String })
  @Expose()
  typeVideo: string;
}

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

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  hourlyRate: number;

  @ApiProperty({ type: String })
  overview: string;

  @ApiProperty({ type: VideoOverview })
  @ValidateNested()
  @Type(() => VideoOverview)
  videoOverview: VideoOverview;

  @ApiProperty({ type: String, enum: HOURS_PER_WEEK })
  @IsEnum(HOURS_PER_WEEK)
  @EnumTransform(HOURS_PER_WEEK)
  hoursPerWeek: HOURS_PER_WEEK;
}
