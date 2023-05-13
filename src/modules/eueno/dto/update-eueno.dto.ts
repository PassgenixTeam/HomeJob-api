import { PartialType } from '@nestjs/swagger';
import { CreateEuenoDto } from './create-eueno.dto';

export class UpdateEuenoDto extends PartialType(CreateEuenoDto) {}
