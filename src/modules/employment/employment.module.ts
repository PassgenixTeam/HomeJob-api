import { Module } from '@nestjs/common';
import { EmploymentService } from './employment.service';
import { EmploymentController } from './employment.controller';
import { EmploymentEntity } from './entities/employment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentEntity])],
  controllers: [EmploymentController],
  providers: [EmploymentService],
})
export class EmploymentModule {}
