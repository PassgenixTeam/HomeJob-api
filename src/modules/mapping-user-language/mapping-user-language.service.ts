import { Injectable, Logger } from '@nestjs/common';
import { CreateMappingUserLanguageDto } from './dto/create-mapping-user-language.dto';
import { UpdateMappingUserLanguageDto } from './dto/update-mapping-user-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingUserLanguageEntity } from './entities/mapping-user-language.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '../../../libs/common/src';
import { MultipleMappingUserLanguageDto } from './dto/multiple-mapping-user-language.dto';
import { LanguageEntity } from '../language/entities/language.entity';

@Injectable()
export class MappingUserLanguageService {
  constructor(
    @InjectRepository(MappingUserLanguageEntity)
    private mappingUserLanguageRepository: Repository<MappingUserLanguageEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(MappingUserLanguageService.name);

  create(input: CreateMappingUserLanguageDto, userId: string) {
    const mappingUserLanguageInstance = plainToInstance(
      MappingUserLanguageEntity,
      input,
    );

    mappingUserLanguageInstance.userId = userId;

    return this.mappingUserLanguageRepository.save(mappingUserLanguageInstance);
  }

  findAll() {
    return this.mappingUserLanguageRepository.find();
  }

  findOne(id: string) {
    return this.mappingUserLanguageRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    input: UpdateMappingUserLanguageDto,
    userId: string,
  ) {
    const mappingUserLanguage =
      await this.mappingUserLanguageRepository.findOne({
        where: {
          id,
        },
      });

    if (!mappingUserLanguage) {
      throw new Error(' mappingUserLanguage not found');
    }

    if (mappingUserLanguage.userId !== userId) {
      throw new Error(
        'You are not allowed to update this  mappingUserLanguage',
      );
    }

    const mappingUserLanguageInstance = plainToInstance(
      MappingUserLanguageEntity,
      input,
    );

    removeKeyUndefined(mappingUserLanguageInstance);

    return this.mappingUserLanguageRepository.save({
      ...mappingUserLanguage,
      ...mappingUserLanguageInstance,
    });
  }

  async updateMultiple(input: MultipleMappingUserLanguageDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userLanguages = await Promise.all(
        input.mappingUserLanguages.map(async (mappingUserLanguage) => {
          const mappingUserLanguageInstance = plainToInstance(
            MappingUserLanguageEntity,
            mappingUserLanguage,
          );

          const language = await this.languageRepository.findOne({
            where: {
              id: mappingUserLanguage.languageId,
            },
          });

          if (!language) {
            throw new Error(
              `Language ${mappingUserLanguage.languageId} not found`,
            );
          }

          mappingUserLanguageInstance.userId = userId;

          return mappingUserLanguageInstance;
        }),
      );

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(MappingUserLanguageEntity)
        .where('userId = :userId', { userId })
        .execute();

      await queryRunner.manager.save(userLanguages);

      await queryRunner.commitTransaction();

      return userLanguages;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, userId: string) {
    const mappingUserLanguage =
      await this.mappingUserLanguageRepository.findOne({
        where: {
          id,
        },
      });

    if (!mappingUserLanguage) {
      throw new Error(' mappingUserLanguage not found');
    }

    if (mappingUserLanguage.userId !== userId) {
      throw new Error(
        'You are not allowed to delete this  mappingUserLanguage',
      );
    }

    return this.mappingUserLanguageRepository
      .createQueryBuilder()
      .delete()
      .from(MappingUserLanguageEntity)
      .where('id = :id', { id })
      .execute();
  }
}
