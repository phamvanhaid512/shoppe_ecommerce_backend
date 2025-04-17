import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto, OrdersProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EntityManager } from 'typeorm';
import { OrdersRepository } from './repository/orders.repository';
import { UserEntity } from 'src/auth/entity/user.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) { }

  async orderPage(transactionManager: EntityManager, user: UserEntity) {
    try {
      const result = await this.ordersRepository.orderPage(transactionManager, user);
      return { status: 200, data: result }
    } catch (error) {
      console.error('❌ Lỗi stack lấy chi tiết giỏ hàng:', error.stack);
      console.error('❌ Lỗi message lấy chi tiết giỏ hàng:', error.message);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Đã có lỗi xảy ra khi lấy chi tiết giỏ hàng',
          error: error.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async addToCart(transactionManager: EntityManager, user: UserEntity, orderProductDto: OrdersProductDto) {
    try {
      const result = await this.ordersRepository.addToCart(transactionManager, user, orderProductDto);
      return { status: 201, data: result };
    } catch (error) {
      console.error('❌ Lỗi stack khi thêm vào giỏ hàng:', error.stack);
      console.error('❌ Lỗi message khi thêm vào giỏ hàng:', error.message);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Đã có lỗi xảy ra khi thêm vào giỏ hàng',
          error: error.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountCart(transactionManager: EntityManager, user: UserEntity) {
    try {
      const result = await this.ordersRepository.getCountCart(transactionManager, user);
      return { status: 200, data: result };

    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Đã có lỗi xảy ra lấy số lượng giỏ hàng',
          error: error.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
