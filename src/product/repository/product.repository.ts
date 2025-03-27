import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async listProduct(transactionManager: EntityManager) {
    try {
      return await transactionManager.find(ProductEntity);
    } catch (error) {
      throw error;
    }
  }

  async detailProduct(transactionManager: EntityManager, id: number) {
    try {
      return await transactionManager.findOne(ProductEntity, id);
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
