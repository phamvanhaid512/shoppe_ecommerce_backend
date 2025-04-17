import { EntityManager, EntityRepository, Repository } from 'typeorm';
import axios from 'axios';
import { getConnection } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersEntity, OrderStatus } from '../entity/order.entity';
import { UserEntity } from 'src/auth/entity/user.entity';
import { OrdersProductsEntity } from '../entity/orders-products';
import { OrdersProductDto } from '../dto/create-order.dto';

@EntityRepository(OrdersEntity)
export class OrdersRepository extends Repository<OrdersEntity> {
    async orderPage(transactionManager: EntityManager, user: UserEntity) {
        try {
            const result = await transactionManager
                .getRepository(OrdersProductsEntity)
                .createQueryBuilder('op')
                .innerJoin('orders','o','op.order_id = o.id')
                .innerJoin('products','p')
        } catch (error) {
            throw new BadRequestException({ message: error.stack || error }, error);
        }
    }
    async addToCart(
        transactionManager: EntityManager,
        user: UserEntity,
        orderProductDto: OrdersProductDto,
    ) {
        try {
            const { product_id, price, quantity } = orderProductDto;
            const user_id = user.id;

            // Tìm giỏ hàng hiện tại của user
            let order = await transactionManager
                .getRepository(OrdersEntity)
                .createQueryBuilder('orders')
                .where('orders.userId = :user_id', { user_id })
                .andWhere('orders.status = :status', { status: OrderStatus.CART })
                .getOne();

            if (!order) {
                order = transactionManager.create(OrdersEntity, {
                    user: { id: user_id },
                    status: OrderStatus.CART,
                });
                await transactionManager.save(order);
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ chưa
            const existingOrderProduct = await transactionManager
                .getRepository(OrdersProductsEntity)
                .createQueryBuilder('orders_products')
                .leftJoin('orders_products.product', 'product')
                .where('orders_products.order_id = :order_id', { order_id: order.id })
                .andWhere('product.id = :product_id', { product_id })
                .getOne();

            if (existingOrderProduct) {
                existingOrderProduct.quantity += quantity;
                existingOrderProduct.price += price;
                return await transactionManager.save(existingOrderProduct);
            } else {
                // Thêm mới sản phẩm vào giỏ
                const newOrderProduct = transactionManager.create(
                    OrdersProductsEntity,
                    {
                        order: { id: order.id },
                        product: { id: product_id },
                        quantity,
                        price,
                    },
                );
                return await transactionManager.save(newOrderProduct);
            }
        } catch (error) {
            throw new BadRequestException({ message: error.message || error }, error);
        }
    }

    async getCountCart(transactionManager: EntityManager, user: UserEntity) {
        try {
            const user_id = user.id;
            console.log('User_id', user_id);
            const count = await transactionManager
                .getRepository(OrdersProductsEntity)
                .createQueryBuilder('op')
                .innerJoin('orders', 'o', 'op.order_id = o.id')
                .where('o.user_id = :userId', { userId: user_id })
                .select('COUNT(DISTINCT op.product_id)', 'count')
                .getRawOne();

            console.log('count', count);
            return count;
        } catch (error) {
            throw new BadRequestException({ message: error.message || error }, error);
        }
    }
}
