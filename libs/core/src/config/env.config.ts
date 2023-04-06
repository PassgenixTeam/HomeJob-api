import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(__dirname, '../../../../.env').replace('/dist', ''),
});

const appConfig = {
  env: process.env.ENV || 'development',
  server: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
  },
  database: {
    MY_SQL: {
      DB_TYPE: process.env.DB_TYPE || 'postgres',
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: process.env.DB_PORT || 5432,
      DB_USERNAME: process.env.DB_USERNAME || 'postgres',
      DB_DATABASE_NAME: process.env.DB_DATABASE_NAME || 'postgres',
      DB_PASSWORD: process.env.DB_PASSWORD || '123456',
    },
    MONGO_DB: {
      DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/nestjs',
    },
  },
  jwt: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'abcxyz',
    JWT_EXPIRES_IN: +process.env.JWT_EXPIRES_IN || 8640000000,
    JWT_REFRESH_EXPIRES_IN: +process.env.JWT_REFRESH_EXPIRES_IN || 8640000000,
  },
  payment: {
    stripe: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    paypal: {
      PAYPAL_URL: process.env.PAYPAL_URL || '',
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
    },
  },
  redis: {
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  },
  s3: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION || '',
  },
};

export { appConfig };
