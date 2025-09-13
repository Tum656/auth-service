import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AuthorizationCode } from './entities/AuthorizationCode.entities';
import { AccessTokens } from './entities/accessTokens.entities';
import { RefreshTokens } from './entities/refreshTokens.entities';
@Module({
  imports: [TypeOrmModule.forFeature([Client, AuthorizationCode,AccessTokens,RefreshTokens])],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
