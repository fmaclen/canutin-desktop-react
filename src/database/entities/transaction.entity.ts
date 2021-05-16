import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';
import { Budget } from './budget.entity';
import { TransactionSubCategory } from './transactionSubCategory.entity';

@Entity()
export class Transaction extends Base {
  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column()
  excludeFromTotals: boolean;

  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Budget, budget => budget.transactions)
  @JoinColumn()
  budget?: Budget;

  @ManyToOne(
    () => TransactionSubCategory,
    transactionSubCategory => transactionSubCategory.transactions,
    {
      cascade: true,
    }
  )
  @JoinColumn()
  category: TransactionSubCategory;

  constructor(
    description: string,
    date: Date,
    amount: number,
    excludeFromTotals: boolean,
    account: Account,
    category: TransactionSubCategory,
    budget?: Budget
  ) {
    super();
    this.description = description;
    this.date = date;
    this.amount = amount;
    this.excludeFromTotals = excludeFromTotals;
    this.account = account;
    this.budget = budget;
    this.category = category;
  }
}
