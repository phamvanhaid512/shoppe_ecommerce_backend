import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './auth/entity/user.entity';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/entity/product.entity';
import { OrdersEntity } from './orders/entity/order.entity';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }), // Nạp biến môi trường
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any, // Cần ép kiểu vì process.env là string
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'shop_project',
      entities: [UserEntity, ProductEntity, OrdersEntity, CategoryEntity], // Import các entity cần thiết
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    }),
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
