import { OrdersEntity } from 'src/orders/entity/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name?: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany(() => OrdersEntity, (order) => order.user)
  order: OrdersEntity[];
}
