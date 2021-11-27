import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { BudgetTypeEnum } from '@enums/budgetType.enum';

import { TransactionSubCategory } from '.';
import { Base } from './base.entity';

@Entity()
export class Budget extends Base {
  @Column()
  name: string;

  @Column()
  targetAmount: number;

  @Column()
  type: BudgetTypeEnum;

  @ManyToMany(() => TransactionSubCategory)
  @JoinTable()
  categories: TransactionSubCategory[]

  constructor(name: string, targetAmount: number, type: BudgetTypeEnum, categories: TransactionSubCategory[]) {
    super();
    this.name = name;
    this.targetAmount = targetAmount;
    this.type = type;
    this.categories = categories;
  }
}
