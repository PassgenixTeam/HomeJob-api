import { ApiProperty } from '@nestjs/swagger';

export class CreateEmploymentDto {
  @ApiProperty({ type: String })
  company: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  country: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  fromMonth: number;

  @ApiProperty({ type: Number })
  fromYear: number;

  @ApiProperty({ type: Number })
  toMonth: number;

  @ApiProperty({ type: Number })
  toYear: number;

  @ApiProperty({ type: Boolean })
  isCurrently: boolean;

  @ApiProperty({ type: String })
  description: string;
}
