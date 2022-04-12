export interface FilterTransactionInterface {
  dateFrom: Date;
  dateTo: Date;
}

export type NewTransactionType = {
  accountId: number;
  description: string | null;
  date: Date;
  categoryName: string;
  amount: number;
  excludeFromTotals: boolean;
  pending: boolean;
  linkId?: string;
  importedAt?: Date;
  id?: number;
  createdAt?: number;
};
