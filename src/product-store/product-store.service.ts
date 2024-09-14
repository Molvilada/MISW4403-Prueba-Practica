import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { StoreEntity } from '../store/store.entity';
import { Repository } from 'typeorm';
import { notFoundMsg } from '../shared/utils';
import { NOT_ASSOCIATED_MSG } from './constants';

@Injectable()
export class ProductStoreService {
  private readonly RESOURCE_PRODUCT: string = 'product';
  private readonly RESOURCE_STORE: string = 'store';

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async addStoreToProduct(
    productId: string,
    storeId: string,
  ): Promise<ProductEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_STORE),
        BusinessError.NOT_FOUND,
      );

    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_PRODUCT),
        BusinessError.NOT_FOUND,
      );

    product.stores = [...product.stores, store];
    return await this.productRepository.save(product);
  }

  async findStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_STORE),
        BusinessError.NOT_FOUND,
      );

    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_PRODUCT),
        BusinessError.NOT_FOUND,
      );

    const productStore: StoreEntity = product.stores.find(
      (e) => e.id === store.id,
    );

    if (!productStore)
      throw new BusinessLogicException(
        NOT_ASSOCIATED_MSG,
        BusinessError.PRECONDITION_FAILED,
      );

    return productStore;
  }

  async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_PRODUCT),
        BusinessError.NOT_FOUND,
      );

    return product.stores;
  }

  async updateStoresFromProduct(
    productId: string,
    stores: StoreEntity[],
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });

    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_PRODUCT),
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < stores.length; i++) {
      const store: StoreEntity = await this.storeRepository.findOne({
        where: { id: stores[i].id },
      });
      if (!store)
        throw new BusinessLogicException(
          notFoundMsg(this.RESOURCE_STORE),
          BusinessError.NOT_FOUND,
        );
    }

    product.stores = stores;
    return await this.productRepository.save(product);
  }

  async deleteStoreFromProduct(productId: string, storeId: string) {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_STORE),
        BusinessError.NOT_FOUND,
      );

    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE_PRODUCT),
        BusinessError.NOT_FOUND,
      );

    const productStore: StoreEntity = product.stores.find(
      (e) => e.id === store.id,
    );

    if (!productStore)
      throw new BusinessLogicException(
        NOT_ASSOCIATED_MSG,
        BusinessError.PRECONDITION_FAILED,
      );

    product.stores = product.stores.filter((e) => e.id !== storeId);
    await this.productRepository.save(product);
  }
}
