import { Entity, Column, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';

@Entity()
export class AccountType extends Base {
  @Column()
  name: string;

  @OneToOne(() => Account, account => account.accountType)
  account?: Account;

  constructor(name: string, account?: Account) {
    super();
    this.name = name ? name : 'checking';
    this.account = account;
  }
}
