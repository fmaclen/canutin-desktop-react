import { BalanceGroupEnum } from '@enums/balancegGroup.enum';

export interface CanutinJsonBudgetType {
  name: string;
  targetAmount: number;
  type: string;
  date: string;
}

export interface CanutinJsonTransactionType {
  description: string;
  date: string;
  amount: number;
  excludeFromTotals: boolean;
  category: string;
  budget?: CanutinJsonBudgetType;
}

export interface CanutinJsonAccountType {
  name: string;
  officialName?: string;
  institution?: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  transactions: CanutinJsonTransactionType[];
}

export interface CanutinJsonType {
  accounts: CanutinJsonAccountType[];
}
