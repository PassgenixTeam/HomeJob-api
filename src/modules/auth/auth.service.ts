import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenPayload, sha512 } from '../../../libs/common/src';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService, appConfig } from '../../../libs/core/src';
import { SessionService } from '../session/session.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private redisService: RedisService,
  ) {}

  async login(input: LoginDto) {
    const { email, password } = input;

    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('Email is not exists');
    }

    if (user.password !== sha512(password)) {
      throw new Error('Password is not correct');
    }

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    await this.sessionService.create({
      accessToken,
      refreshToken,
      user: user,
    });

    return {
      user,
      token: {
        accessToken,
        refreshToken,
        expiredIn: appConfig.jwt.JWT_EXPIRES_IN,
      },
    };
  }

  async register(input: RegisterDto) {
    const { email, password, firstName, lastName } = input;

    const isExistsEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (isExistsEmail) {
      throw new Error('Email is already exist');
    }

    return this.usersRepository.save({
      email,
      password: sha512(password),
      firstName,
      lastName,
    });
  }

  createAccessToken(user: UserEntity): string {
    const token = this.jwtService.sign(
      {
        uid: user.id,
        cacheId: uuidV4(),
      },
      {
        expiresIn: appConfig.jwt.JWT_EXPIRES_IN,
        secret: appConfig.jwt.JWT_SECRET_KEY,
      },
    );
    return token;
  }

  createRefreshToken(user: UserEntity) {
    const token = this.jwtService.sign(
      { uid: user.id },
      {
        expiresIn: appConfig.jwt.JWT_EXPIRES_IN,
        secret: appConfig.jwt.JWT_SECRET_KEY,
      },
    );
    return token;
  }

  async refreshToken(token: string) {
    const payloadRefreshToken = this.jwtService.decode(token) as TokenPayload;

    const isValidSession = await this.sessionService.findToken(
      payloadRefreshToken.uid,
      token,
    );

    if (!isValidSession) {
      throw new UnauthorizedException();
    }

    const payloadAccessToken = this.jwtService.decode(
      isValidSession.accessToken,
    ) as TokenPayload;

    await this.redisService.del(payloadAccessToken.cacheId);

    await this.sessionService.invalidSession(isValidSession.id);
    const accessToken = this.createAccessToken({
      id: payloadRefreshToken.uid,
    } as UserEntity);

    const refreshToken = this.isTokenExpired(payloadRefreshToken)
      ? this.createRefreshToken({
          id: payloadRefreshToken.uid,
        } as UserEntity)
      : token;

    await this.sessionService.create({
      accessToken,
      refreshToken,
      user: {
        id: payloadRefreshToken.uid,
      } as UserEntity,
    });

    return {
      accessToken,
      refreshToken,
      expiredIn: appConfig.jwt.JWT_EXPIRES_IN,
    };
  }

  logout() {
    // TODO: implement logout
  }

  private isTokenExpired(token: any): boolean {
    const now = Date.now() / 1000;
    return token.exp < now;
  }
}
