import { Controller, Get } from '@nestjs/common';
import { EuenoService } from './eueno.service';

@Controller('eueno')
export class EuenoController {
  constructor(private readonly euenoService: EuenoService) {}

  @Get('upload-file')
  uploadFile() {
    return this.euenoService.uploadFile();
  }
}
