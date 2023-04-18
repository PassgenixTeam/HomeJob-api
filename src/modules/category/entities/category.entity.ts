import { BaseEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { SubCategoryEntity } from '../../sub-category/entities/sub-category.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category, {
    onDelete: 'CASCADE',
  })
  subCategories: SubCategoryEntity[];
}
