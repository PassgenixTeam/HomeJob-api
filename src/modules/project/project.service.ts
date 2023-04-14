import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  differenceMultiArray,
  removeKeyUndefined,
} from '../../../libs/common/src';
import { FileQueue } from '../file/queues/file.queue';
import { FileEntity } from '../file/entities/file.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly fileQueue: FileQueue,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(ProjectService.name);

  async create(input: CreateProjectDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const projectInstance = plainToInstance(ProjectEntity, input);
      projectInstance.userId = userId;

      if (input.attachments) {
        const attachments = await this.fileRepository
          .createQueryBuilder('file')
          .where('file.url IN (:...urls)', { urls: input.attachments })
          .getMany();

        projectInstance.attachments = JSON.stringify(
          attachments.map((file) => {
            return {
              url: file.url,
              size: file.size,
            };
          }),
        );
      }

      const project = await queryRunner.manager.save(projectInstance);

      if (input.attachments) {
        await this.fileQueue.updateFileUsing(input.attachments);
      }

      await queryRunner.commitTransaction();

      return project;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.projectRepository.find();
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new Error('project not found');
    }

    return project;
  }

  async update(id: string, input: UpdateProjectDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let attachmentList1Only: string[] = [];
      let attachmentList2Only: string[] = [];

      const project = await this.projectRepository.findOne({
        where: { id },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      if (project.userId !== userId) {
        throw new Error('You are not allowed to update this project');
      }

      const projectInstance = plainToInstance(ProjectEntity, input);

      if (input.attachments) {
        const { common, list1Only, list2Only } = differenceMultiArray(
          JSON.parse(project.attachments).map((file) => file.url),
          input.attachments,
        );

        attachmentList1Only = list1Only;
        attachmentList2Only = list2Only;

        const attachments = await this.fileRepository
          .createQueryBuilder('file')
          .where('file.url IN (:...urls)', { urls: input.attachments })
          .getMany();

        projectInstance.attachments = JSON.stringify(
          attachments.map((file) => {
            return {
              url: file.url,
              size: file.size,
            };
          }),
        );
      }

      removeKeyUndefined(projectInstance);

      const projectUpdate = await this.projectRepository.save({
        ...project,
        ...projectInstance,
      });

      if (input.attachments) {
        await Promise.all([
          this.fileQueue.updateFileUsing(attachmentList2Only),
          this.fileQueue.deleteFileUsing(attachmentList1Only),
        ]);
      }

      return projectUpdate;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== userId) {
      throw new Error('You are not allowed to delete this project');
    }

    if (project.attachments) {
      const attachments = JSON.parse(project.attachments);
      await this.fileQueue.deleteFileUsing(attachments.map((file) => file.url));
    }

    return this.projectRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectEntity)
      .where('id = :id', { id })
      .execute();
  }
}
