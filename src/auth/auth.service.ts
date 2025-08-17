import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AuthorizationCode } from './entities/AuthorizationCode.entities';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client) private clientsRepo: Repository<Client>,
    @InjectRepository(AuthorizationCode) private codesRepo: Repository<AuthorizationCode>,
  ) {}
  
  generateClientCredentials() {
    const clientId = uuidv4(); // ใช้ UUID เป็น client_id
    const clientSecret = randomBytes(32).toString('hex'); // สุ่ม 32 bytes

    return { clientId, clientSecret };
  }


    async validateClient(clientId: string, redirectUri: string) {
    if (!clientId || !redirectUri) {
      throw new BadRequestException('invalid_request');
    }
    const client = await this.clientsRepo.findOne({ where: { clientId } });
    if (!client) throw new BadRequestException('unauthorized_client');
    if (client.redirectUri !== redirectUri) {
      throw new BadRequestException('invalid_redirect_uri');
    }
    return client;
  }

    async issueAuthorizationCode(userId: number, client: Client, redirectUri: string) {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // อายุ 5 นาที

    const entity = this.codesRepo.create({
      code,
      userId,
      clientId: client.id,
      redirectUri,
      expiresAt,
    });
    await this.codesRepo.save(entity);
    return entity;
  }

    private generateCode(): string {
    return randomBytes(32).toString('hex'); // ยาว 64 ตัวอักษร
  }

  buildRedirectWithParams(base: string, params: Record<string, string | undefined>) {
    const url = new URL(base);
    Object.entries(params).forEach(([k, v]) => {
      if (typeof v !== 'undefined' && v !== null) url.searchParams.set(k, String(v));
    });
    return url.toString();
  }
}
