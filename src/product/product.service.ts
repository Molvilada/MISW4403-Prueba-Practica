import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { INCORRECT_TYPE_MSG, PRODUCT_TYPES } from './constants';
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
      relations: ['products'],
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    if (!PRODUCT_TYPES.includes(product.type))
      throw new BusinessLogicException(
        INCORRECT_TYPE_MSG,
        BusinessError.BAD_REQUEST,
      );
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

    if (!PRODUCT_TYPES.includes(product.type))
      throw new BusinessLogicException(
        INCORRECT_TYPE_MSG,
        BusinessError.BAD_REQUEST,
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
