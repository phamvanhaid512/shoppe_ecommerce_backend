import { CategoryEntity } from 'src/category/entities/category.entity';
import { OrdersEntity } from 'src/orders/entity/order.entity';
import { OrdersProductsEntity } from 'src/orders/entity/orders-products';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  price: number;

  @Column()
  rating: number;

  @Column()
  quantity: number;

  @Column()
  sold: number;

  @Column()
  view: number;

  @Column()
  content?: string;

  @Column()
  categoryId: number;

  @ManyToMany(() => OrdersEntity, (order) => order.products)
  orders: OrdersEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.product)
  @JoinColumn({ name: 'categoy_id' })
  category: CategoryEntity;

  @OneToMany(() => OrdersProductsEntity, (orderProduct) => orderProduct.product)
  @JoinColumn({ name: 'product_id' })
  ordersProduct: OrdersProductsEntity[];

}
