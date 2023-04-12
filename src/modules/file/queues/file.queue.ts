import { InjectQueue } from '@nestjs/bull';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Queue } from 'bull';

export class FileQueue {
  constructor(
    @InjectQueue('file')
    private readonly fileQueue: Queue,
  ) {}

  async updateFileUsing(urls: string[]) {
    if (!urls || !urls.length) {
      return;
    }
    return await this.fileQueue.add('update-file-using', {
      urls,
    });
  }

  async createFile(
    files: Express.Multer.File[],
    s3Files: ManagedUpload.SendData[],
  ) {
    return await this.fileQueue.add('create-file', {
      files,
      s3Files,
    });
  }

  async deleteFileUsing(urls: string[]) {
    if (!urls || !urls.length) {
      return;
    }
    return await this.fileQueue.add('delete-file-using', {
      urls,
    });
  }
}
