import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { TransformInterceptor } from './common/filters/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

app.use(
  session({
    secret: configService.get<string>('SESSION_SECRET')!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
      secure: process.env.NODE_ENV === 'production', // ควรเปิดเมื่อใช้ https
    },
  }),
);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
