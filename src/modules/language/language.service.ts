import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageEntity } from './entities/language.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { removeKeyUndefined } from '../../../libs/common/src';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  create(input: CreateLanguageDto) {
    const languageInstance = plainToInstance(LanguageEntity, input);
    return this.languageRepository.save(languageInstance);
  }

  findAll() {
    return this.languageRepository.find();
  }

  findOne(id: string) {
    return this.languageRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, input: UpdateLanguageDto) {
    const language = this.languageRepository.findOne({
      where: {
        id,
      },
    });

    if (!language) {
      throw new Error('Language not found');
    }

    const languageInstance = plainToInstance(LanguageEntity, input);

    removeKeyUndefined(languageInstance);

    return this.languageRepository.save({
      ...language,
      ...languageInstance,
    });
  }

  remove(id: string) {
    return this.languageRepository
      .createQueryBuilder()
      .delete()
      .from(LanguageEntity)
      .where('id = :id', { id })
      .execute();
  }
}
