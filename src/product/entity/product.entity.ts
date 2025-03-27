import { CategoryEntity } from 'src/category/entities/category.entity';
import { OrdersEntity } from 'src/orders/entity/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  price: number;

  @Column()
  content: string;

  @Column()
  categoryId: number;

  @ManyToMany(() => OrdersEntity, (order) => order.products)
  orders: OrdersEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.product)
  @JoinColumn({ name: 'categoy_id' })
  category: CategoryEntity;
}
