export interface CanutinJsonBudgetType {
  name: string;
  targetAmount: number;
  type: string;
  date: string;
}

export interface CanutinJsonCategoryType {
  name: string;
}

export interface CanutinJsonTransactionType {
  description: string;
  date: string;
  amount: number;
  excludeFromTotals: boolean;
  category: CanutinJsonCategoryType[];
  budget?: CanutinJsonBudgetType[];
}

export interface CanutinJsonAccountType {
  name: string;
  balanceGroup: string;
  accountType: string;
  transactions: CanutinJsonTransactionType[];
}

export interface CanutinJsonType {
  accounts: CanutinJsonAccountType[];
}
