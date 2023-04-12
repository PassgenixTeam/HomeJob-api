import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerMiddleware } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { appConfig } from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SessionService } from '../../../src/modules/session/session.service';
import { SessionEntity } from '../../../src/modules/session/entities/session.entity';
import { CacheModule } from './cache/cache.module';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public').replace('/dist', ''),
    }),
    //
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // MongooseModule.forRoot(appConfig.database.MONGO_DB.DB_URI),
    //
    TypeOrmModule.forFeature([SessionEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig.jwt.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: appConfig.jwt.JWT_EXPIRES_IN,
        },
      }),
    }),
    CacheModule.register(),
    BullModule.forRoot({
      redis: {
        host: appConfig.redis.REDIS_HOST,
        port: +appConfig.redis.REDIS_PORT,
        password: appConfig.redis.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    JwtService,
    JwtStrategy,
    SessionService,
  ],

  exports: [
    CacheModule,
    PassportModule,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
