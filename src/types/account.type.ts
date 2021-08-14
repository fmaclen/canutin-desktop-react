export type NewAccountType = {
  name: string;
  accountType: string;
  officialName?: string;
  institution?: string;
  balance?: number;
  autoCalculate: boolean | string;
};

export type AccountEditBalanceSubmitType = {
  accountId: number;
  autoCalculate: boolean;
  balance: number;
  closed: boolean;
};
