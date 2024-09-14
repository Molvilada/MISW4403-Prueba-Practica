import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { StoreDto } from './store.dto';
import { StoreEntity } from './store.entity';
import { plainToInstance } from 'class-transformer';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll() {
    return await this.storeService.findAll();
  }

  @Get(':storeId')
  async findOne(@Param('storeId') storeId: string) {
    return await this.storeService.findOne(storeId);
  }

  @Post()
  async create(@Body() storeDto: StoreDto) {
    const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
    return await this.storeService.create(store);
  }

  @Put(':storeId')
  async update(@Param('storeId') storeId: string, @Body() storeDto: StoreDto) {
    const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
    return await this.storeService.update(storeId, store);
  }

  @Delete(':storeId')
  @HttpCode(204)
  async delete(@Param('storeId') storeId: string) {
    return await this.storeService.delete(storeId);
  }
}
