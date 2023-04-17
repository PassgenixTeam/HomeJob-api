import { BaseEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { MappingUserLanguageEntity } from '../../mapping-user-language/entities/mapping-user-language.entity';

@Entity({ name: 'languages' })
export class LanguageEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => MappingUserLanguageEntity, (mapping) => mapping.language, {
    onDelete: 'CASCADE',
  })
  mappingUserLanguageEntity: MappingUserLanguageEntity[];
}
