import { fromUnixTime } from 'date-fns';

import { dateInUTC } from '@app/utils/date.utils';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import {
  CanutinFileAccountBalanceStatementType,
  CanutinFileAssetBalanceStatementType,
  CanutinFileTransactionType,
} from '@appTypes/canutinFile.type';

import {
  accountCheckingDetails,
  accountSavingsDetails,
  accountCreditCardDetails,
  accountAutoLoanDetails,
  accountRothIraDetails,
  account401kDetails,
  accountWalletDetails,
} from '@database/seed/demoData/accounts';
import {
  assetSecurityTeslaDetails,
  assetSecurityGamestopDetails,
  assetCryptoBitcoinDetails,
  assetCryptoEthereumDetails,
  assetCollectibleDetails,
  assetVehicleDetails,
} from '@database/seed/demoData/assets';
import {
  accountCheckingTransactionSet,
  accountSavingsTransactionSet,
  accountCreditCardTransactionSet,
} from '@database/seed/demoData/transactions';
import {
  account401kbalanceStatements,
  accountAutoLoanBalanceStatements,
  accountRothIraBalanceStatements,
  accountWalletBalanceStatements,
  assetTeslaBalanceStatements,
  assetGamestopBalanceStatements,
  assetBitcoinBalanceStatements,
  assetEthereumBalanceStatements,
  assetCollectibleBalanceStatements,
  assetVehicleBalanceStatements,
} from '@database/seed/demoData/balanceStatements';

interface SeedType {
  name: string;
}

interface SeedBalanceStatement {
  createdAt: Date;
  quantity?: number;
  cost?: number;
  value?: number;
}

export interface SeedTransactionCategory {
  id?: number;
  name: string;
}

// FIXME: consider replacing this with CanutinFileTransactionType
export interface SeedTransaction {
  description: string;
  amount: number;
  date: Date;
  categoryName: string;
  excludeFromTotals: boolean;
  pending: boolean;
  category?: SeedTransactionCategory;
  account?: SeedAccount;
}

// FIXME: consider replacing this with CanutinFileAccountType
export interface SeedAccount {
  name: string;
  balanceGroup: BalanceGroupEnum;
  autoCalculated: boolean;
  closed: boolean;
  accountType: string | SeedType;
  officialName?: string;
  institution?: string;
  transactions?: SeedTransaction[];
  balanceStatements?: SeedBalanceStatement[];
}

// FIXME: consider replacing this with CanutinFileAssetType
export interface SeedAsset {
  name: string;
  balanceGroup: BalanceGroupEnum;
  assetType: SeedType;
  sold: boolean;
  symbol?: string;
  balanceStatements?: SeedBalanceStatement[];
}

const handleTransactionsSet = (transactions: CanutinFileTransactionType[]) =>
  transactions.map(transaction => ({
    ...transaction,
    date: dateInUTC(fromUnixTime(transaction.date)),
  }));

const handleSeedBalanceStatements = (
  balanceStatements:
    | CanutinFileAccountBalanceStatementType[]
    | CanutinFileAssetBalanceStatementType[]
) =>
  // The order of the `balanceStatements` in `accountsIndex`/`assetsIndex` is
  // important but the balances in `seedDemoData.ts` are expressed in the opposite
  // order so this function reverses them so we can use them in the tests.
  balanceStatements.reverse().map(balanceStatement => ({
    ...balanceStatement,

    // The `createdAt` timestamps in `seedDemoData.ts` are expressed in Unix
    // timestamps and we need to parse them as Date objects.
    createdAt: fromUnixTime(balanceStatement.createdAt),
  }));

export const seedMinimumAccount = [{ ...accountCheckingDetails, id: 1, transactions: [] }];

export const seedAccounts: SeedAccount[] = [
  {
    ...accountCheckingDetails,
    accountType: { name: accountCheckingDetails.accountType },
    transactions: handleTransactionsSet(accountCheckingTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountSavingsDetails,
    accountType: { name: accountSavingsDetails.accountType },
    transactions: handleTransactionsSet(accountSavingsTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountCreditCardDetails,
    accountType: { name: accountCreditCardDetails.accountType },
    transactions: handleTransactionsSet(accountCreditCardTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountAutoLoanDetails,
    accountType: { name: accountAutoLoanDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountAutoLoanBalanceStatements),
  },
  {
    ...accountRothIraDetails,
    accountType: { name: accountRothIraDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountRothIraBalanceStatements),
  },
  {
    ...account401kDetails,
    accountType: { name: account401kDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(account401kbalanceStatements),
  },
  {
    ...accountWalletDetails,
    accountType: { name: accountWalletDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountWalletBalanceStatements),
  },
];

export const seedAssets: SeedAsset[] = [
  {
    ...assetSecurityTeslaDetails,
    assetType: { name: assetSecurityTeslaDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetTeslaBalanceStatements),
  },
  {
    ...assetSecurityGamestopDetails,
    assetType: { name: assetSecurityGamestopDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetGamestopBalanceStatements),
  },
  {
    ...assetCryptoBitcoinDetails,
    assetType: { name: assetCryptoBitcoinDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetBitcoinBalanceStatements),
  },
  {
    ...assetCryptoEthereumDetails,
    assetType: { name: assetCryptoEthereumDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetEthereumBalanceStatements),
  },
  {
    ...assetCollectibleDetails,
    assetType: { name: assetCollectibleDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetCollectibleBalanceStatements),
  },
  {
    ...assetVehicleDetails,
    assetType: { name: assetVehicleDetails.assetType },
    balanceStatements: handleSeedBalanceStatements(assetVehicleBalanceStatements),
  },
];
