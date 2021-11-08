export type NewAccountType = {
  name: string;
  accountType: string;
  officialName?: string;
  institution?: string;
  balance?: number;
  autoCalculated: boolean;
};

export type AccountEditBalanceSubmitType = {
  accountId: number;
  balance: number;
  autoCalculated: boolean;
  closed: boolean;
};

export type AccountEditDetailsSubmitType = {
  accountId: number;
  accountTypeName: string;
  balanceGroup: number;
  name: string;
  institution?: string;
};
