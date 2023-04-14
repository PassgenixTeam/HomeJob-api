import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { EducationEntity } from './entities/education.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EducationEntity])],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
