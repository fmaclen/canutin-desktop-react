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
import { fromUnixTime } from 'date-fns';
import {
  CanutinFileAccountBalanceStatementType,
  CanutinFileAssetBalanceStatementType,
} from '@appTypes/canutinFile.type';

const handleSeedBalanceStatements = (
  balanceStatements:
    | CanutinFileAccountBalanceStatementType[]
    | CanutinFileAssetBalanceStatementType[]
) =>
  balanceStatements.reverse().map(balanceStatement => ({
    ...balanceStatement,
    createdAt: fromUnixTime(balanceStatement.createdAt),
  }));

export const seedAccounts = [
  {
    ...accountCheckingDetails,
    transactions: accountCheckingTransactionSet(),
    balanceStatements: [],
  },
  {
    ...accountSavingsDetails,
    transactions: accountSavingsTransactionSet(),
    balanceStatements: [],
  },
  {
    ...accountCreditCardDetails,
    transactions: accountCreditCardTransactionSet(),
    balanceStatements: [],
  },
  {
    ...accountAutoLoanDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountAutoLoanBalanceStatements),
  },
  {
    ...accountRothIraDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountRothIraBalanceStatements),
  },
  {
    ...account401kDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(account401kbalanceStatements),
  },
  {
    ...accountWalletDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountWalletBalanceStatements),
  },
];

export const seedAssets = [
  {
    ...assetSecurityTeslaDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetTeslaBalanceStatements),
  },
  {
    ...assetSecurityGamestopDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetGamestopBalanceStatements),
  },
  {
    ...assetCryptoBitcoinDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetBitcoinBalanceStatements),
  },
  {
    ...assetCryptoEthereumDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetEthereumBalanceStatements),
  },
  {
    ...assetCollectibleDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetCollectibleBalanceStatements),
  },
  {
    ...assetVehicleDetails,
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetVehicleBalanceStatements),
  },
];
