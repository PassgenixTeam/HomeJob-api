import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Query,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, AuthUser } from '../../../libs/core/src';
import { multerMemoryOption } from '../../../libs/common/src';
import { FilterFileDto } from './dto/filter-file.dto';
import { FileService } from './file.service';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Get a file all' })
  @Get('')
  async getAll(@Query() filter: FilterFileDto) {
    return this.fileService.getAll(filter);
  }

  @ApiOperation({ summary: 'Create files' })
  @Auth()
  @UseInterceptors(FilesInterceptor('files', null, multerMemoryOption))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'The file files size is greater than 25 MB',
  })
  @Post()
  file(
    @UploadedFiles() files: Express.Multer.File[],
    @AuthUser('id') userId: string,
  ) {
    return this.fileService.create(files);
  }

  @ApiOperation({ summary: 'Delete all file' })
  @Delete()
  async removeAll() {
    return this.fileService.removeAll();
  }
}
