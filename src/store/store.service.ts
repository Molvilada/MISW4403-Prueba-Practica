import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './store.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { notFoundMsg } from '../shared/utils';

@Injectable()
export class StoreService {
  private readonly RESOURCE: string = 'store';

  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find({});
  }

  async findOne(id: string): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    return await this.storeRepository.save(store);
  }

  async update(id: string, store: StoreEntity): Promise<StoreEntity> {
    const persistedStore: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });

    if (!persistedStore)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    store.id = id;

    return await this.storeRepository.save(store);
  }

  async delete(id: string) {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.RESOURCE),
        BusinessError.NOT_FOUND,
      );

    await this.storeRepository.remove(store);
  }
}
