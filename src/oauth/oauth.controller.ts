import { Controller, Res, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Response } from 'express';
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}
@Post('token')
async token(
  @Res() res: Response,
  @Body('grant_type') grantType: string,
  @Body('code') code: string,
  @Body('client_id') clientId: string,
  @Body('client_secret') clientSecret: string,
  @Body('redirect_uri') redirectUri: string,
) {
  if (grantType !== 'authorization_code') {
    throw new BadRequestException('Unsupported grant_type');
  }

  const tokenResponse = await this.oauthService.exchangeCodeForToken(
    code,
    clientId,
    clientSecret,
    redirectUri,
  );

  if (!tokenResponse) {
    throw new UnauthorizedException('Invalid code or client');
  }

  return res.status(200).json(tokenResponse);
}
}
