import { NewTransactionType } from '@appTypes/transaction.type';

export interface UserAuthProps {
  login: string;
  password: string;
  confirmPassword?: string;
}

export interface UserAuthResponseProps {
  status: number;
  error?: string[]; // ['login', 'no matching login']
}

export interface ProfileProps {
  email: string;
  hasBetaAccess: boolean;
}

export interface InstitutionProps {
  id: string; // 'randomHash123abc
  name: string;
  errorTitle: string;
  errorMessage: string;
  lastUpdate: Date;
}

interface SummaryErrorProps {
  user: boolean;
  institution: boolean;
}

export interface SummaryResponseProps {
  profile: ProfileProps;
  institutions: InstitutionProps[];
  errors: SummaryErrorProps;
}

export interface AssetPricesProps {
  symbol: string;
  type: string;
  latestPrice: number;
}

export interface RemoteAccountProps {
  accountType: string;
  autoCalculated: boolean;
  balance: number;
  balanceGroup: string;
  institutionName: string;
  linkId: string;
  name: string;
  officialName: string;
  transactions?: NewTransactionType[];
}

export interface SyncResponseProps {
  accounts: RemoteAccountProps[];
  removedTransactions: string[];
  assetPrices: AssetPricesProps[];
}
