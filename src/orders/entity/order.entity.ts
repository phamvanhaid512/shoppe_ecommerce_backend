import { UserEntity } from 'src/auth/entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdersProductsEntity } from './orders-products';

export enum OrderStatus {
  CART = 'CART',
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CART
  })
  status: OrderStatus

  @Column({ default: 0 })
  sum_total: number;

  // @OneToMany(() => UserEntity, (user) => user.order)
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.order)
  @JoinColumn({ name: 'user_id' }) // Đây mới là nơi tạo user_id
  user: UserEntity;
  @ManyToMany(() => ProductEntity, (product) => product.id)
  products: ProductEntity[];

  @OneToMany(() => OrdersProductsEntity, (ordersProduct) => ordersProduct.order, { cascade: true })
  @JoinColumn({ name: 'order_id' })
  ordersProduct: OrdersProductsEntity[];
}
