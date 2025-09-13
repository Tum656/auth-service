import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development','production','test').required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().allow(''),
        DB_NAME: Joi.string().required(),
      }),
    }),
  ],
})
export class AppConfigModule {}
