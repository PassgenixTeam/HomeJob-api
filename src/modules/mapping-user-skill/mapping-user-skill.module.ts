import { Module } from '@nestjs/common';
import { MappingUserSkillService } from './mapping-user-skill.service';
import { MappingUserSkillController } from './mapping-user-skill.controller';
import { MappingUserSkillEntity } from './entities/mapping-user-skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSkillEntity } from '../sub-skill/entities/sub-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MappingUserSkillEntity, SubSkillEntity])],
  controllers: [MappingUserSkillController],
  providers: [MappingUserSkillService],
})
export class MappingUserSkillModule {}
