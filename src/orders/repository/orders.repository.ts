import { EntityManager, EntityRepository, Repository } from 'typeorm';
import axios from 'axios';
import { getConnection } from 'typeorm';
import {
    BadRequestException,
    forwardRef,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { OrdersEntity, OrderStatus } from '../entity/order.entity';
import { UserEntity } from 'src/auth/entity/user.entity';
import { OrdersProductsEntity } from '../entity/orders-products';
import { OrdersProductDto } from '../dto/create-order.dto';

@EntityRepository(OrdersEntity)
export class OrdersRepository extends Repository<OrdersEntity> {
    async savePayment(
        transactionManager: EntityManager,
        user: UserEntity,
        ordersProductDto: OrdersProductDto,
        id: number
    ) {
        console.log("id", id);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { sum_total, orderDetails } = ordersProductDto;
        const user_id = user.id;
        const order = await transactionManager
            .getRepository(OrdersEntity)
            .createQueryBuilder('orders')
            .where('orders.user.id = :user_id', { user_id })
            .andWhere('id = :id', { id })
            .select('orders.id').getOne();
        console.log("order", order);
        if (!order) {
            const orderDetail = transactionManager.create(OrdersEntity, {
                user: { id: user_id },
                id: id,
                sum_total: sum_total
            })
            await transactionManager.save(orderDetail);
        } else {
            console.log("payment");

            const orderDetail = await transactionManager.update(OrdersEntity, { user_id: user_id, id: id, status: OrderStatus.CART }, { sum_total: sum_total })
            console.log("payment", orderDetail);
        }

        for (const item of orderDetails) {
            const { product_id, price, quantity } = item;

            console.log("product", product_id, price, quantity)
            await transactionManager.getRepository(OrdersProductsEntity)
                .createQueryBuilder()
                .update(OrdersProductsEntity) // thay bằng entity thực tế
                .set({
                    price: price,
                    quantity: quantity,
                })
                .where('order_id = :order_id', { order_id: id })
                .andWhere('product_id = :product_id', { product_id: product_id })
                .execute();
        }
        await queryRunner.commitTransaction();
    }
    async deleteAllCart(transactionManager: EntityManager, user: UserEntity) {
        const user_id = user.id;
        const orders = await transactionManager
            .getRepository(OrdersEntity)
            .createQueryBuilder('orders')
            .where('user_id = :user_id', { user_id })
            .getMany();
        if (orders.length === 0) {
            throw new NotFoundException(
                `Không có sản phẩm nào trong giỏ hàng để xóa`,
            );
        }
        const orderId = orders.map((order) => order.id);
        await transactionManager
            .getRepository(OrdersProductsEntity)
            .createQueryBuilder('orders_products')
            .delete()
            .where('order_id = :orderId', { orderId })
            .execute();
    }

    async deleteCartItem(
        transactionManager: EntityManager,
        user: UserEntity,
        id: number,
    ) {
        const orderProduct = await transactionManager
            .getRepository(OrdersProductsEntity)
            .findOne({ where: { id } });

        if (!orderProduct) {
            throw new NotFoundException(
                `Không tìm thấy sản phẩm với id: ${id} trong giỏ hàng`,
            );
        }

        await transactionManager.getRepository(OrdersProductsEntity).delete({ id });
    }

    async orderPage(transactionManager: EntityManager, user: UserEntity) {
        try {
            const user_id = user.id;

            const result = await transactionManager
                .getRepository(OrdersProductsEntity)
                .createQueryBuilder('op')
                .innerJoin('op.order', 'o')
                .innerJoin('o.user', 'u')
                .innerJoin('op.product', 'p')
                .where('u.id = :user_id', { user_id })
                .select([
                    'o.id AS order_id',
                    'op.id AS order_product_id',
                    'op.quantity AS so_luong',
                    'p.id AS product_id',
                    'p.name AS product_name',
                    'p.logo AS product_logo',
                    'p.price AS product_price',
                    'p.quantity AS product_quantity',
                    'p.content AS product_content',
                ])
                .getRawMany(); // << dùng cái này thay vì getMany()
            return result;
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
                .where('orders.user_id = :user_id', { user_id })
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
