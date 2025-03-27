import { UserEntity } from 'src/auth/entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @OneToMany(() => UserEntity, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => ProductEntity, (product) => product.orders)
  @JoinTable({ name: 'oder_products' })
  products: ProductEntity[];
}
