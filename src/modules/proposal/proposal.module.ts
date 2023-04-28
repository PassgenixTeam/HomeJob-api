import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from './entities/proposal.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CoinEntity } from '../coin/entities/coin.entity';
import { FileModule } from '../file/file.module';
import { CoinModule } from '../coin/coin.module';
import { FileEntity } from '../file/entities/file.entity';
import { JobEntity } from 'src/modules/job/entities/job.entity';

@Module({
  imports: [
    FileModule,
    CoinModule,
    TypeOrmModule.forFeature([
      ProposalEntity,
      UserEntity,
      CoinEntity,
      FileEntity,
      JobEntity,
    ]),
  ],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
