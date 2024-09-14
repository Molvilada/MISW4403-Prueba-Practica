import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './store.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { cityRegex, INCORRECT_CITY_MSG } from './constants';
import { notFoundMsg } from '../shared/utils';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    private resource: String = 'store',
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: string): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!store)
      throw new BusinessLogicException(
        notFoundMsg(this.resource),
        BusinessError.NOT_FOUND,
      );

    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    if (!cityRegex.test(store.city))
      throw new BusinessLogicException(
        INCORRECT_CITY_MSG,
        BusinessError.BAD_REQUEST,
      );
    return await this.storeRepository.save(store);
  }

  async update(id: string, store: StoreEntity): Promise<StoreEntity> {
    const persistedStore: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });

    if (!persistedStore)
      throw new BusinessLogicException(
        notFoundMsg(this.resource),
        BusinessError.NOT_FOUND,
      );

    if (!cityRegex.test(store.city))
      throw new BusinessLogicException(
        INCORRECT_CITY_MSG,
        BusinessError.BAD_REQUEST,
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
        notFoundMsg(this.resource),
        BusinessError.NOT_FOUND,
      );

    await this.storeRepository.remove(store);
  }
}
