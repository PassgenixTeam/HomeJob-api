import { Injectable } from '@nestjs/common';
import { UploadDto } from './dto/create-upload.dto';
import { S3UploadService } from '../../../libs/upload/src';
import { FILE_STATUS } from './enum/file.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFileDto } from './dto/filter-file.dto';
import { FileEntity } from './entities/file.entity';
import { FileQueue } from './queues/file.queue';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly s3UploadService: S3UploadService,
    private readonly fileQueue: FileQueue,
  ) {}

  async getAll(filter: FilterFileDto) {
    const { status } = filter;
    const query = this.fileRepository.createQueryBuilder('file');

    if (status) {
      query.andWhere('file.status = :status', { status });
    }

    return query.getMany();
  }

  async create(files: Express.Multer.File[]) {
    const s3Files = await this.s3UploadService.s3UploadMultiple(files);

    await this.fileQueue.createFile(
      files.map((file) => ({
        ...file,
        buffer: undefined,
      })),
      s3Files,
    );

    return s3Files.map((file, i) => ({
      url: file.Location,
      size: files[i].size,
      type: files[i].mimetype,
    }));
  }

  async removeAll() {
    const files = await this.fileRepository.find({
      where: [{ status: FILE_STATUS.PENDING }, { status: FILE_STATUS.DELETED }],
    });

    await this.s3UploadService.deleteFiles(
      files.map((file) => ({ Key: file.key })),
    );

    return this.fileRepository.delete(files.map((file) => file.id));
  }
}
