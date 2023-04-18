import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  categoryId: string;
}
