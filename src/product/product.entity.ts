import { StoreEntity } from '../store/store.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @ManyToMany(() => StoreEntity, (store) => store.products)
  stores: StoreEntity[];
}
