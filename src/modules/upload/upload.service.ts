import { Injectable } from '@nestjs/common';
import { UploadDto } from './dto/create-upload.dto';
import { S3UploadService } from '../../../libs/upload/src';
import { FILE_STATUS } from './enum/upload.enum';
import { UploadEntity } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFileDto } from './dto/filter-file.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadEntity: Repository<UploadEntity>,
    private readonly s3UploadService: S3UploadService,
  ) {}

  async getAll(filter: FilterFileDto) {
    const { status } = filter;
    const query = this.uploadEntity.createQueryBuilder('upload');

    if (status) {
      query.andWhere('upload.status = :status', { status });
    }

    return query.getMany();
  }

  async create(files: Express.Multer.File[]) {
    const s3Files = await this.s3UploadService.s3UploadMultiple(files);
    const newUploads = s3Files.map(async (file, i) => {
      const upload = this.uploadEntity.create({
        url: file.Location,
        key: file.Key,
        status: FILE_STATUS.PENDING,
        size: files[i].size,
        type: files[i].mimetype,
      });

      return this.uploadEntity.save(upload);
    });

    return Promise.all(newUploads);
  }

  async removeAll() {
    const files = await this.uploadEntity.find({
      where: [{ status: FILE_STATUS.PENDING }, { status: FILE_STATUS.DELETED }],
    });

    await this.s3UploadService.deleteFiles(
      files.map((file) => ({ Key: file.key })),
    );

    return this.uploadEntity.delete(files.map((file) => file.id));
  }
}
