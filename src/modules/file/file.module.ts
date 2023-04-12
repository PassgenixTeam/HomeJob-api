import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { S3UploadService } from '../../../libs/upload/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';
import { FileQueue } from './queues/file.queue';
import { FileJob } from './jobs/file.job';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'file',
    }),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  controllers: [FileController],
  providers: [FileService, S3UploadService, FileQueue, FileJob],
  exports: [FileService, FileQueue, FileJob],
})
export class FileModule {}
