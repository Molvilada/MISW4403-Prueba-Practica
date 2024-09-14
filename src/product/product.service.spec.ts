import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

import { faker } from '@faker-js/faker';
import { INCORRECT_TYPE_MSG, PRODUCT_TYPES } from './constants';
import { notFoundMsg } from '../shared/utils';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList: ProductEntity[];

  const RESOURCE: string = 'product';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
        type: faker.helpers.arrayElement(PRODUCT_TYPES),
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productsList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.price).toEqual(storedProduct.price);
    expect(product.type).toEqual(storedProduct.type);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      notFoundMsg(RESOURCE),
    );
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: '',
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
      type: faker.helpers.arrayElement(PRODUCT_TYPES),
      stores: [],
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.price).toEqual(product.price);
    expect(storedProduct.type).toEqual(product.type);
  });

  it('create should throw an exception for an invalid type product', async () => {
    const product: ProductEntity = {
      id: '',
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
      type: 'Invalid type',
      stores: [],
    };

    await expect(() => service.create(product)).rejects.toHaveProperty(
      'message',
      INCORRECT_TYPE_MSG,
    );
  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productsList[0];
    product.name = 'New name';

    const updatedProduct: ProductEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product,
      name: 'New name',
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      notFoundMsg(RESOURCE),
    );
  });

  it('update should throw an exception for an invalid type product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product,
      type: 'Invalid type',
    };
    await expect(() =>
      service.update(product.id, product),
    ).rejects.toHaveProperty('message', INCORRECT_TYPE_MSG);
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);

    const deletedProduct: ProductEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      notFoundMsg(RESOURCE),
    );
  });
});
