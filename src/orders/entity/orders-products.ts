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
import { OrdersEntity } from './order.entity';

@Entity('orders_products')
export class OrdersProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrdersEntity, (order) => order.ordersProduct, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: OrdersEntity;

    @ManyToOne(() => ProductEntity, (product) => product.ordersProduct, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })  // Chỉ định tên cột cho sản phẩm
    product: ProductEntity;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    price: number;
}
