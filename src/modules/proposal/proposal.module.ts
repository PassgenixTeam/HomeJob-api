import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { CoinService } from '../coin/coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from './entities/proposal.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CoinEntity } from '../coin/entities/coin.entity';
import { FileQueue } from '../file/queues/file.queue';
import { RedisService } from '../../../libs/core/src';
import { FileModule } from '../file/file.module';
import { CoinModule } from '../coin/coin.module';
import { FileEntity } from '../file/entities/file.entity';

@Module({
  imports: [
    FileModule,
    CoinModule,
    TypeOrmModule.forFeature([
      ProposalEntity,
      UserEntity,
      CoinEntity,
      FileEntity,
    ]),
  ],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
