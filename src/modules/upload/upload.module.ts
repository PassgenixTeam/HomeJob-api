import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { S3UploadService } from '../../../libs/upload/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadEntity])],
  controllers: [UploadController],
  providers: [UploadService, S3UploadService],
})
export class UploadModule {}
