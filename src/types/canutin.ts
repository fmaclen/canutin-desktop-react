import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export interface CanutinFileBudgetType {
  name: string;
  targetAmount: number;
  type: string;
  date: string;
}

export interface CanutinFileTransactionType {
  description: string;
  date: string;
  amount: number;
  excludeFromTotals: boolean;
  category: string;
  createdAt?: number;
  budget?: CanutinFileBudgetType;
}

export interface CanutinFileAccountBalanceStatementType {
  createdAt: number;
  value: number;
}

export interface CanutinFileAssetBalanceStatementType {
  createdAt: number;
  quantity?: number;
  cost?: number;
  value?: number;
}

export interface CanutinFileAccountType {
  name: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  autoCalculated: boolean;
  closed: boolean;
  officialName?: string;
  institution?: string;
  transactions?: CanutinFileTransactionType[];
  balanceStatements?: CanutinFileAccountBalanceStatementType[];
}

export interface CanutinFileAssetType {
  name: string;
  type: string;
  balanceGroup: BalanceGroupEnum;
  sold: boolean;
  symbol?: string;
  balanceStatements?: CanutinFileAssetBalanceStatementType[];
}

export interface CanutinFileType {
  accounts: CanutinFileAccountType[];
  assets?: CanutinFileAssetType[];
}

export interface UpdatedAccount {
  id: number;
  transactions: CanutinFileTransactionType[];
}
