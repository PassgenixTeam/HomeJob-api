import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { readFileSync } from 'fs';
import { appConfig } from '@app/core';
import { randomNumber } from '@app/common';

interface File {
  Key: string;
}

@Injectable()
export class S3UploadService {
  private s3 = new AWS.S3({
    credentials: {
      accessKeyId: appConfig.s3.AWS_ACCESS_KEY,
      secretAccessKey: appConfig.s3.AWS_SECRET_KEY,
    },
    region: appConfig.s3.AWS_BUCKET_REGION,
  });

  async getFile(key: string) {
    const params = {
      Bucket: 'your-bucket-name',
      Key: key,
      Expires: 3600, // Thời gian URL hết hạn tính bằng giây.
      ResponseContentDisposition: `attachment; filename=${key}`, // Tên tệp tin khi tải xuống.
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async s3Upload(file: Partial<Express.Multer.File>) {
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: appConfig.s3.AWS_BUCKET_NAME,
        Key:
          file.filename ||
          `${new Date().getTime()}${randomNumber()}.${file.originalname
            .split('.')
            .pop()}`,
        Body: file.path ? readFileSync(file.path) : file.buffer,
        ContentType: file.mimetype,
      };
      const data = await this.s3.upload(params).promise();
      console.log(data);
      return data;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('File upload failed');
    }
  }

  async s3UploadMultiple(files: Array<Express.Multer.File>) {
    const params = files.map((file) => {
      return {
        Bucket: appConfig.s3.AWS_BUCKET_NAME,
        Key:
          file.filename ||
          `${new Date().getTime()}${randomNumber()}.${file.originalname
            .split('.')
            .pop()}`,
        Body: file.path ? readFileSync(file.path) : file.buffer,
        ContentType: file.mimetype,
      };
    });

    try {
      const data = await Promise.all(
        params.map((param) => this.s3.upload(param).promise()),
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('File upload failed');
    }
  }

  deleteFile(file: File) {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: appConfig.s3.AWS_BUCKET_NAME,
      Key: file.Key,
    };

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err.message);
          return reject(false);
        }
        console.log(data);

        return resolve(true);
      });
    });
  }

  deleteFiles(files: Array<File>) {
    const Keys = files.map((file) => {
      return {
        Key: file.Key,
      };
    });

    const params = {
      Bucket: appConfig.s3.AWS_BUCKET_NAME,
      Delete: { Objects: Keys },
    };

    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        console.log(data);

        return resolve(data);
      });
    });
  }
}
