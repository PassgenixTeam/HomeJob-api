import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/common';
import { UserEntity } from '../../user/entities/user.entity';
import { LanguageEntity } from '../../language/entities/language.entity';

@Entity({ name: 'mapping_user_languages' })
export class MappingUserLanguageEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.mappingUserLanguageEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'uuid', name: 'language_id' })
  languageId: string;

  @ManyToOne(() => LanguageEntity, (user) => user.mappingUserLanguageEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @Column()
  level: string;
}
