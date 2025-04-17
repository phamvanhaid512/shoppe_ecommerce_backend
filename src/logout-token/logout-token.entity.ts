import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogoutTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  createAt: Date;
}
