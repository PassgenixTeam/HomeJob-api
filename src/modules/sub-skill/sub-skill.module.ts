import { Module } from '@nestjs/common';
import { SubSkillService } from './sub-skill.service';
import { SubSkillController } from './sub-skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSkillEntity } from './entities/sub-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubSkillEntity])],
  controllers: [SubSkillController],
  providers: [SubSkillService],
})
export class SubSkillModule {}
