import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export interface CanutinFileTransactionType {
  description: string;
  date: number;
  amount: number;
  excludeFromTotals: boolean;
  category: string;
  pending: boolean;
  linkId?: string;
  createdAt?: number;
}

// FIXME: there is duplication with `NewAccountBalanceStatementType`
export interface CanutinFileAccountBalanceStatementType {
  createdAt: number;
  value: number;
}

// FIXME: there is duplication with `NewAccountType`
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

export interface CanutinFileAssetBalanceStatementType {
  createdAt: number;
  quantity?: number;
  cost?: number;
  value?: number;
}

// FIXME: there is a lot of duplication with `NewAssetType`
export interface CanutinFileAssetType {
  name: string;
  balanceGroup: BalanceGroupEnum;
  assetType: string;
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
