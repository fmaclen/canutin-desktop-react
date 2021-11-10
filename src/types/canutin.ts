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

export interface CanutinFileBalanceStatementType {
  createdAt: number;
  value: number;
}

export interface CanutinFileAccountType {
  name: string;
  autoCalculated: boolean;
  balance?: number;
  officialName?: string;
  institution?: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  transactions?: CanutinFileTransactionType[];
  balanceStatements?: CanutinFileBalanceStatementType[];
}

export interface CanutinFileAssetType {
  type: string;
  balanceGroup: BalanceGroupEnum;
  name: string;
  symbol?: string;
  quantity?: number;
  cost?: number;
  value?: number;
}

export interface CanutinFileType {
  accounts: CanutinFileAccountType[];
  assets?: CanutinFileAssetType[];
}

export interface UpdatedAccount {
  id: number;
  transactions: CanutinFileTransactionType[];
}
