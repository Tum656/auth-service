import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationCode } from './entities/AuthorizationCode.entities';
import { Client } from './entities/client.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Client, AuthorizationCode])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
