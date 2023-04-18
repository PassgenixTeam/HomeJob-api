import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryEntity } from './entities/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryEntity } from '../category/entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryEntity)
    private subCategoryRepository: Repository<SubCategoryEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(input: CreateSubCategoryDto) {
    const subCategoryInstance = plainToInstance(SubCategoryEntity, input);

    const category = await this.categoryRepository.findOne({
      where: {
        id: input.categoryId,
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return this.subCategoryRepository.save(subCategoryInstance);
  }

  findAll() {
    return this.subCategoryRepository.find();
  }

  findOne(id: string) {
    return this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.subCategoryRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
