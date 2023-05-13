import { Module } from '@nestjs/common';
import { EuenoService } from './eueno.service';
import { EuenoController } from './eueno.controller';

@Module({
  controllers: [EuenoController],
  providers: [EuenoService],
})
export class EuenoModule {}
