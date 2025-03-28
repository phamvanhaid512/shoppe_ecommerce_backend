import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductRepository } from './repository/product.repository';
import { ProductEntity } from './entity/product.entity';
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async fetchDataProduct(transactionManager: EntityManager) {
    try {
      const result = this.productRepository.fetchData(transactionManager);
      return { status: 200, data: result };
    } catch (error) {
      throw error;
    }
  }
  async listProduct(transactionManager: EntityManager) {
    try {
      const result =
        await this.productRepository.listProduct(transactionManager);
      return { status: 200, data: result };
    } catch (error) {
      throw error;
    }
  }

  async detailProduct(transactionManager: EntityManager, id: number) {
    try {
      const result = await this.productRepository.detailProduct(
        transactionManager,
        id,
      );
      return result; // Đảm bảo trả về đầy đủ dữ liệu
    } catch (error) {
      throw error;
    }
  }

  async createProduct(
    transactionManager: EntityManager,
    createProductDto: CreateProductDto,
  ) {
    try {
      const result = await this.productRepository.createProduct(
        transactionManager,
        createProductDto,
      );
      return { status: 200, data: result };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    transactionManager: EntityManager,
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const result = await this.productRepository.updateProduct(
        transactionManager,
        id,
        updateProductDto,
      );
      return { status: 200, data: 'Update successfully' };
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(transactionManager: EntityManager, id: number) {
    try {
      const result = await this.productRepository.deleteProduct(
        transactionManager,
        id,
      );
      return { status: 200, data: 'Delete successfully' };
    } catch (error) {
      throw error;
    }
  }
}
