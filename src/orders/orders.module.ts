import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from './repository/orders.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
