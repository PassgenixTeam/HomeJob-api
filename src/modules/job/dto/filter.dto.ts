import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnumTransform } from '../../../../libs/common/src';
import { JOB_TYPE } from '../enums/job.enum';

export class FilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experienceLevel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(JOB_TYPE)
  @EnumTransform(JOB_TYPE)
  jobType: JOB_TYPE;
}
