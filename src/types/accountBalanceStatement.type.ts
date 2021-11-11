import { Account } from '@database/entities/account.entity';

export type NewBalanceStatementType = {
  createdAt?: Date;
  value: number;
  account: Account;
};
