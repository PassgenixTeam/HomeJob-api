import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty({ type: 'string' })
  type: string;

  @ApiProperty({ type: 'string' })
  size: number;

  @ApiProperty({ type: 'string' })
  url: string;

  @ApiProperty({ type: 'string' })
  key: string;
}
