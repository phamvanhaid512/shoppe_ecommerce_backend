import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrdersProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Connection, TransactionManager } from 'typeorm';
import { SessionGuard } from 'src/auth/guards/session.guards';
import { GetUser } from 'src/user/get-user.decorator';
import { UserEntity } from 'src/auth/entity/user.entity';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,
    private readonly connection: Connection
  ) { }


  @UseGuards(SessionGuard)
  @Get('order-page')
  async orderPage(@GetUser() user:UserEntity) {
    return await this.connection.transaction((transactionManager) => {
      return this.ordersService.orderPage(transactionManager,user)
    })
  }

  @UseGuards(SessionGuard)
  @Get('/get-count-cart')
  async getCountCart(@GetUser() user: UserEntity) {
    return await this.connection.transaction((transactionManager) => {
      return this.ordersService.getCountCart(transactionManager, user)
    })
  }

  @UseGuards(SessionGuard)
  @Post('/add-to-cart')
  async addToCart(@GetUser() user: UserEntity, @Body() orderProductDto: OrdersProductDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.ordersService.addToCart(transactionManager, user, orderProductDto)
    })
  }
  @UseGuards(SessionGuard)
  @Get('/orders')
  findAll() {
    // return req.user.id;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
