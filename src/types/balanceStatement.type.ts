import { Account } from '@database/entities/account.entity';

export type NewBalanceStatementType = {
  value?: number;
  account: Account;
};
