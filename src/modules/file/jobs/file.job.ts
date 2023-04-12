import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { FILE_STATUS } from '../enum/file.enum';
import { Logger } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Processor('file')
export class FileJob {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  private readonly logger = new Logger(FileJob.name);

  @Process('update-file-using')
  async updateFileUsing(job: Job<{ urls: string[] }>) {
    const { urls } = job.data;

    const updateFiles = urls.map(async (url) => {
      return this.fileRepository.update({ url }, { status: FILE_STATUS.USING });
    });

    await Promise.all(updateFiles);

    this.logger.log('Files are updated');

    return true;
  }

  @Process('create-file')
  async create(
    job: Job<{
      files: Express.Multer.File[];
      s3Files: ManagedUpload.SendData[];
    }>,
  ) {
    const { s3Files, files } = job.data;

    const newUploads = s3Files.map(async (file, i) => {
      const upload = this.fileRepository.create({
        url: file.Location,
        key: file.Key,
        status: FILE_STATUS.PENDING,
        size: files[i].size,
        type: files[i].mimetype,
      });

      return this.fileRepository.save(upload);
    });

    await Promise.all(newUploads);

    this.logger.log('New files are created');

    return true;
  }

  @Process('delete-file-using')
  async deleteFileUsing(job: Job<{ urls: string[] }>) {
    const { urls } = job.data;

    const deleteFiles = urls.map(async (url) => {
      return this.fileRepository.update(
        { url },
        { status: FILE_STATUS.DELETED },
      );
    });

    await Promise.all(deleteFiles);

    this.logger.log('Files are deleted');

    return true;
  }
}
