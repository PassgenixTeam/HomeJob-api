import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UserTokenDto } from './dto/user-token.dto';
import { REDIS_PROVIDER, appConfig } from '@app/core';
import { UserEntity } from '../user/entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { RedisService } from '../../../libs/core/src/cache/redis.service';
import {
  instanceToInstance,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionEntity: Repository<SessionEntity>,
    private readonly redisService: RedisService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const { accessToken, refreshToken, user } = createSessionDto;
    const session = this.sessionEntity.create({
      accessToken,
      refreshToken,
      user,
    });

    return this.sessionEntity.save(session);
  }

  async validateSession(payload: UserTokenDto) {
    const { userId, cacheId, token } = payload;
    const cacheSessionJson = await this.redisService.get(cacheId);

    if (cacheSessionJson) {
      const cacheSession: UserEntity = JSON.parse(cacheSessionJson);
      if (
        cacheSession?.loginSession?.accessToken === token &&
        cacheSession.id === userId
      ) {
        return cacheSession;
      }
    }

    const session = await this.sessionEntity.findOne({
      where: {
        user: {
          id: userId,
        },
        expiredAt: IsNull(),
        accessToken: token,
      },
      relations: ['user'],
    });

    if (session) {
      const user = instanceToPlain(session.user);

      delete user.password;
      delete session.user;

      const data = {
        ...user,
        loginSession: session,
        cacheId,
      };

      await this.redisService.set(
        cacheId,
        JSON.stringify(data),
        appConfig.jwt.JWT_EXPIRES_IN ?? undefined,
      );

      return data as UserEntity;
    }
  }

  async findToken(id: string, token: string): Promise<SessionEntity> {
    return this.sessionEntity.findOne({
      where: { user: { id }, refreshToken: token, expiredAt: IsNull() },
    });
  }

  async invalidAllSessionByUserId(userId: string): Promise<boolean> {
    return (
      (
        await this.sessionEntity.update(
          { user: { id: userId }, expiredAt: IsNull() },
          { expiredAt: new Date() },
        )
      ).affected > 0
    );
  }

  async invalidSession(id: string): Promise<UpdateResult> {
    return this.sessionEntity.update(id, { expiredAt: new Date() });
  }
}
