import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id', unique: true })
  clientId: string;

  @Column({ name: 'client_secret', type: 'text' })
  clientSecret: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ name: 'redirect_uri', type: 'text' })
  redirectUri: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
