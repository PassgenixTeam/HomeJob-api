import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  description: string;

  @Column()
  scopeType: string;

  @Column()
  scopeLevel: string;

  @Column()
  scopeTime: string;

  @Column()
  budget: number;

  @Column()
  hourlyTo: number;

  @Column()
  hourlyFrom: number;

  @Column()
  attachments: string;

  @Column()
  status: string;
}
