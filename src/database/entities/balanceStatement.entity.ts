import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';

@Entity({ name: 'account_balance_statement' })
export class BalanceStatement extends Base {
  @Column({ nullable: true })
  value?: number;

  @ManyToOne(() => Account, account => account.balanceStatements, { eager: false })
  @JoinColumn()
  account: Account;

  constructor(account: Account, createdAt: Date, value?: number) {
    super();
    this.value = value;
    this.account = account;
    this.createdAt = createdAt;
  }
}
