import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { TransactionCategory } from '.';
import { Base } from './base.entity';

@Entity()
export class Budget extends Base {
  @Column()
  name: string;

  @Column()
  targetAmount: number;

  @Column()
  type: string;

  @ManyToMany(() => TransactionCategory)
  @JoinTable()
  categories: TransactionCategory[]

  constructor(name: string, targetAmount: number, type: string, categories: TransactionCategory[]) {
    super();
    this.name = name;
    this.targetAmount = targetAmount;
    this.type = type;
    this.categories = categories;
  }
}
