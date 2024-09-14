import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { notFoundMsg } from '../shared/utils';

@Injectable()
export class ProductService {
  private readonly RESOURCE: string = 'product';

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: ['stores'],
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct: ProductEntity =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!persistedProduct)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    product.id = id;

    return await this.productRepository.save(product);
  }

  async delete(id: string) {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    await this.productRepository.remove(product);
  }
}
