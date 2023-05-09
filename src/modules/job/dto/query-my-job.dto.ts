import { EnumTransform } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JOB_STATUS, JOB_TYPE } from 'src/modules/job/enums/job.enum';

export class QueryMyJobDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  visibility: string;

  @ApiProperty({ type: String, required: false, enum: JOB_STATUS })
  @IsOptional()
  @IsEnum(JOB_STATUS)
  @EnumTransform(JOB_STATUS)
  status: JOB_STATUS[];

  @ApiProperty({ type: String, required: false, enum: JOB_TYPE })
  @IsOptional()
  @IsEnum(JOB_TYPE)
  @EnumTransform(JOB_TYPE)
  type: JOB_TYPE;
}
