import { Column, Entity } from 'typeorm';
import { FILE_STATUS } from '../enum/file.enum';
import { BaseEntity } from '@app/common';

@Entity({ name: 'files' })
export class FileEntity extends BaseEntity {
  @Column()
  type: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column({ type: 'enum', enum: FILE_STATUS })
  status: FILE_STATUS;
}
