import { Module } from '@nestjs/common';
import { MappingUserLanguageService } from './mapping-user-language.service';
import { MappingUserLanguageController } from './mapping-user-language.controller';
import { MappingUserLanguageEntity } from './entities/mapping-user-language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageEntity } from '../language/entities/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MappingUserLanguageEntity, LanguageEntity]),
  ],
  controllers: [MappingUserLanguageController],
  providers: [MappingUserLanguageService],
})
export class MappingUserLanguageModule {}
