import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async fetchDataProduct() {
    try {
      const fetchShopeeData = async () => {
        const url = 'https://api-ecom.duthanhduoc.com/products';

        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            Cookie: 'SPC_EC=your_cookie_here',
          },
        });

        const product = response.data;
      };
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

      return { status: 200, data: result };
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
