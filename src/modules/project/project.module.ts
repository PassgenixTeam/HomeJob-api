import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { FileQueue } from '../file/queues/file.queue';
import { FileModule } from '../file/file.module';
import { FileEntity } from '../file/entities/file.entity';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([ProjectEntity, FileEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
