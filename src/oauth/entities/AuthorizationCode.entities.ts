import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('authorization_codes')
export class AuthorizationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'client_id', type: 'int' })
  clientId: number;

  @Column({ name: 'redirect_uri', type: 'text', nullable: true })
  redirectUri?: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
