import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { OauthModule } from './modules/oauth/oauth.module';
import { AppConfigModule } from './core/confing/config.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [AppConfigModule,DatabaseModule , UsersModule, OauthModule]
})
export class AppModule {}
