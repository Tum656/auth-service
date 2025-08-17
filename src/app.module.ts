import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'center',
      password: '123456123',
      database: 'auth',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production!
    }),AuthModule, UsersModule, OauthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
