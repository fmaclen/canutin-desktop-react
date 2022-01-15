export interface FilterTransactionInterface {
  dateFrom: Date;
  dateTo: Date;
}

export type NewTransactionType = {
  accountId: number;
  description: string | null;
  date: Date;
  categoryName: string;
  balance: number;
  excludeFromTotals: boolean;
  pending: boolean;
  id?: number;
  linkId?: string;
  createdAt?: number;
};
