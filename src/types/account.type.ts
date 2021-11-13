import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { NewBalanceStatementType } from './accountBalanceStatement.type';
import { CanutinFileAccountBalanceStatementType } from './canutin';

// FIXME: consider extending `NewAccountType` from `Account` and ommitting the un-necessary values.
export type NewAccountType = {
  name: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  autoCalculated: boolean;
  closed: boolean;
  officialName?: string;
  institution?: string;
  balanceStatements?: NewBalanceStatementType[] | CanutinFileAccountBalanceStatementType[];
};

export type AccountEditBalanceSubmitType = {
  accountId: number;
  autoCalculated: boolean;
  balance: number;
  closed: boolean;
};

export type AccountEditDetailsSubmitType = {
  accountId: number;
  accountTypeName: string;
  balanceGroup: number;
  name: string;
  institution?: string;
};
