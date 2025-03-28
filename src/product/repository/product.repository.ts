import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import axios from 'axios';
import { getConnection } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async listProduct(transactionManager: EntityManager) {
    try {
      return await transactionManager.find(ProductEntity);
    } catch (error) {
      throw error;
    }
  }

  async fetchData(transactionManager: EntityManager) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const url = 'https://api-ecom.duthanhduoc.com/products';

      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          Cookie: 'SPC_EC=your_cookie_here',
        },
      });

      console.log('API Response:', response.data);

      const products = response.data?.data?.products || [];
      // if (!Array.isArray(products) || products.length === 0 ) {
      //   throw new Error('Invalid or empty API response');
      // }

      throw new Error('chay den day thoi');

      const newProducts = products.map((productData) =>
        queryRunner.manager.create(ProductEntity, {
          name: productData.name,
          logo: productData.image,
          price: productData.price,
          rating: productData.rating,
          quantity: productData.quantity,
          content: 'em la ai',
          sold: productData.sold,
          view: productData.view,
          categoryId: 1,
        }),
      );

      await queryRunner.manager.save(ProductEntity, newProducts);

      await queryRunner.commitTransaction();
      return { message: 'Products saved successfully' };
    } catch (error) {
      console.error('Error fetching products:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw new Error('Failed to fetch products');
    }
  }

  async detailProduct(transactionManager: EntityManager, id: number) {
    try {
      console.log('id', id);

      // Đảm bảo ID là kiểu số
      const numericId = Number(id);

      // Viết truy vấn với các cột cụ thể
      const data = await transactionManager
        .getRepository(ProductEntity)
        .createQueryBuilder('products')
        .select([
          'products.id',
          'products.logo',
          'products.name',
          'products.price',
          'products.content',
          'products.rating',
          'products.quantity',
          'products.sold',
          'products.view',
        ])
        .where('products.id = :id', { id: id })
        .getOne();

      console.log('data', data);

      if (!data) {
        throw new NotFoundException('Product not found');
      }

      return { status: 200, data };
    } catch (error) {
      throw error;
    }
  }

  async createProduct(
    transactionManager: EntityManager,
    createProductDto: CreateProductDto,
  ) {
    const { name, logo, price, content } = createProductDto;

    try {
      const result = transactionManager.create(ProductEntity, {
        name,
        logo,
        price,
        content,
        categoryId: 1,
      });
      return await transactionManager.save(result);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    transactionManager: EntityManager,
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    const { name, logo, price, content } = updateProductDto;

    try {
      return await transactionManager.update(
        ProductEntity,
        { id },
        {
          name,
          logo,
          price,
          content,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(transactionManager: EntityManager, id: number) {
    try {
      return await transactionManager
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
