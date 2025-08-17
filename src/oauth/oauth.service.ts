import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizationCode } from './entities/AuthorizationCode.entities';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AccessTokens } from './entities/accessTokens.entities';
import { RefreshTokens } from './entities/refreshTokens.entities';

@Injectable()
export class OauthService {
    constructor(
      @InjectRepository(Client) private clientsRepo: Repository<Client>,
      @InjectRepository(AuthorizationCode) private authCodeRepo: Repository<AuthorizationCode>,
    @InjectRepository(AccessTokens) private accessTokenRepo: Repository<AccessTokens>,
   @InjectRepository(RefreshTokens) private refreshTokenRepo: Repository<RefreshTokens>,
    ) {}

  private generateCode(): string {
        return randomBytes(32).toString('hex'); // ยาว 64 ตัวอักษร
  }
    
async exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
) {
  const client = await this.clientsRepo.findOne({ where: { clientId: clientId } });
  if (!client || client.clientSecret !== clientSecret) {
    return null;
  }

  const authCode = await this.authCodeRepo.findOne({ where: { code, clientId: client.id } });
  if (!authCode) return null;

  if (new Date() > authCode.expiresAt) return null;
  if (authCode.redirectUri !== redirectUri) return null;

  // generate tokens
  const accessToken = this.generateCode();
  const refreshToken = this.generateCode();

  await this.accessTokenRepo.save({
    token: accessToken,
    userId: authCode.userId,
    clientId: client.id,
    scope: 'read',
    expiresAt: new Date(Date.now() + 3600 * 1000),
  });

  await this.refreshTokenRepo.save({
    token: refreshToken,
    userId: authCode.userId,
    clientId: client.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
  });
  await this.authCodeRepo.delete(authCode.id);

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
  };
}

}
