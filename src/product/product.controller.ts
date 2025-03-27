import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Connection, Transaction, TransactionManager } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly connection: Connection,
  ) {}

  @Get('/listProduct')
  async listProduct() {
    return await this.connection.transaction((transactionManager) => {
      return this.productService.listProduct(transactionManager);
    });
  }

  @Get('fetchDataProduct')
  async fetchDataProduct() {
    return await this.productService.fetchDataProduct();
  }

  @Get('/detail/:id')
  async detailProduct(@Param('id') id: number) {
    return await this.connection.transaction((transactionManager) => {
      return this.productService.detailProduct(transactionManager, id);
    });
  }

  @Post('/createProduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.connection.transaction((transactionManager) => {
      return this.productService.createProduct(
        transactionManager,
        createProductDto,
      );
    });
  }

  @Put('/updateProduct/:id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: number,
  ) {
    return await this.connection.transaction((transactionManager) => {
      return this.productService.updateProduct(
        transactionManager,
        id,
        updateProductDto,
      );
    });
  }

  @Delete('/delete/:id')
  async deleteProduct(@Param('id') id: number) {
    return await this.connection.transaction((transactionManager) => {
      return this.productService.deleteProduct(transactionManager, id);
    });
  }
}
