import { ApiProperty } from '@nestjs/swagger';
import {
  EXPERIENCE_LEVEL,
  JOB_STATUS,
  PROJECT_LENGTH,
  SCOPE_TYPE,
} from '../enums/job.enum';
import { IsEnum } from 'class-validator';
import { EnumTransform } from '../../../../libs/common/src';

export class CreateJobDto {
  @ApiProperty({ type: String, description: 'Title' })
  title: string;

  // @ApiProperty({ type: String, description: 'Subtitle' })
  // subtitle: string;

  @ApiProperty({ type: String, description: 'Description' })
  description: string;

  @ApiProperty({ type: String, description: 'Scope Type', enum: SCOPE_TYPE })
  @IsEnum(SCOPE_TYPE)
  @EnumTransform(SCOPE_TYPE)
  scopeType: SCOPE_TYPE;

  @ApiProperty({
    type: String,
    description: 'Scope Level',
    enum: EXPERIENCE_LEVEL,
  })
  @IsEnum(EXPERIENCE_LEVEL)
  @EnumTransform(EXPERIENCE_LEVEL)
  experienceLevel: EXPERIENCE_LEVEL;

  @ApiProperty({
    type: String,
    description: 'Scope Time',
    enum: PROJECT_LENGTH,
  })
  @IsEnum(PROJECT_LENGTH)
  @EnumTransform(PROJECT_LENGTH)
  projectLength: PROJECT_LENGTH;

  @ApiProperty({ type: Number, description: 'Budget' })
  budget: number;

  @ApiProperty({ type: Number, description: 'Hourly To' })
  hourlyTo: number;

  @ApiProperty({ type: Number, description: 'Hourly From' })
  hourlyFrom: number;

  @ApiProperty({ type: [String], description: 'Attachments' })
  attachments: string[];

  @ApiProperty({ type: String, enum: JOB_STATUS, description: 'Status' })
  @IsEnum(JOB_STATUS)
  @EnumTransform(JOB_STATUS)
  status: JOB_STATUS;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: Object })
  moreInfo: any;
}
