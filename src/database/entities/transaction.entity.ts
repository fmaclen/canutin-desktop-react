import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';
import { Budget } from './budget.entity';
import { TransactionCategory } from './transactionCategory.entity';

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
  account: Account;

  @ManyToOne(() => Budget, budget => budget.transactions)
  budget?: Budget;

  @OneToOne(() => TransactionCategory, transactionCategory => transactionCategory.transaction)
  @JoinColumn()
  category: TransactionCategory;

  constructor(
    description: string,
    date: Date,
    amount: number,
    excludeFromTotals: boolean,
    account: Account,
    category: TransactionCategory,
    budget?: Budget,
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
