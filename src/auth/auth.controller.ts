import { Controller, Post , Get , Query, Req,  Res, BadRequestException, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


 @Post('register')
  registerClient() {
    const { clientId, clientSecret } = this.authService.generateClientCredentials();
    return {
      client_id: clientId,
      client_secret: clientSecret,
    };
  }


  @Get('authorize')
  async authorize(
    @Req() req: Request,
    @Res() res: Response,
    @Query('response_type') responseType: string,
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('scope') scope?: string,
    @Query('state') state?: string,
    @Query('prompt') prompt?: string, // ใช้กำหนดว่าจะให้ขึ้นหน้า consent หรือ auto-approve
  ) {
    if (responseType !== 'code') {
      throw new BadRequestException('unsupported_response_type');
    }

    // 2) ตรวจ client & redirect_uri
    const client = await this.authService.validateClient(clientId, redirectUri);

    // 3) (ตัวอย่าง) consent page แบบง่าย
    // - ถ้าอยากให้ขึ้นหน้า consent เสมอ ให้ลบ auto-approve ด้านล่าง
    // - ถ้า prompt=consent ให้แสดงฟอร์มให้ผู้ใช้กดยืนยัน
    if (prompt === 'consent') {
      return res.status(200)
        .send(`
          <html>
            <body style="font-family: sans-serif">
              <h3>แอป "${client.name || client.clientId}" ขอสิทธิ์เข้าถึง</h3>
              <p>Scope: ${scope || '(none)'}</p>
              <form method="POST" action="http://localhost:3000/auth/authorize/decision">
                <input type="hidden" name="client_id" value="${clientId}"/>
                <input type="hidden" name="redirect_uri" value="${encodeURIComponent(redirectUri)}"/>
                <input type="hidden" name="state" value="${state || ''}"/>
                <input type="hidden" name="scope" value="${scope || ''}"/>
                <button type="submit" name="approve" value="yes">อนุญาต</button>
                <button type="submit" name="approve" value="no">ปฏิเสธ</button>
              </form>
            </body>
          </html>
        `);
    }

    const userId: number = (req as any).user?.id || (req as any).session?.userId;
    const codeEntity = await this.authService.issueAuthorizationCode(userId, client, redirectUri);

    const redirect = this.authService.buildRedirectWithParams(redirectUri, {
      code: codeEntity.code,
      state,
    });
    return res.redirect(302, redirect);
  }

  @Post('authorize/decision')
  async decision(
    @Req() req: Request,
    @Res() res: Response,
    @Body('approve') approve: 'yes' | 'no',
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUriRaw: string,
    @Body('state') state?: string,
    @Body('scope') scope?: string,
  ) {
    const redirectUri = decodeURIComponent(redirectUriRaw || '');
    const client = await this.authService.validateClient(clientId, redirectUri);

    if (approve !== 'yes') {
      const redirectDeny = this.authService.buildRedirectWithParams(redirectUri, {
        error: 'access_denied',
        state,
      });
      return res.redirect(302, redirectDeny);
    }

    const userId: number = (req as any).user?.id || (req as any).session?.userId;
    const codeEntity = await this.authService.issueAuthorizationCode(userId, client, redirectUri);

    const redirectOK = this.authService.buildRedirectWithParams(redirectUri, {
      code: codeEntity.code,
      state,
    });
    return res.redirect(302, redirectOK);
  }
}
