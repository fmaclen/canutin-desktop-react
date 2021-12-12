import { AccountRepository } from '@database/repositories/account.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { AssetRepository } from '@database/repositories/asset.repository';

import {
  accountCheckingDetails,
  accountSavingsDetails,
  accountCreditCardDetails,
  accountAutoLoanDetails,
  accountRothIraDetails,
  account401kDetails,
  accountWalletDetails,
} from './demoData/accounts';
import {
  assetSecurityTeslaDetails,
  assetSecurityGamestopDetails,
  assetCryptoBitcoinDetails,
  assetCryptoEthereumDetails,
  assetCollectibleDetails,
  assetVehicleDetails,
} from './demoData/assets';
import {
  accountCheckingMonthlyTransactions,
  accountSavingsMonthlyTransactions,
  accountCreditCardMonthlyTransactions,
} from './demoData/transactions';
import {
  account401kbalanceStatements,
  accountAutoLoanBalanceStatements,
  accountRothIraBalanceStatements,
  accountWalletBalanceStatements,
  assetTeslaBalanceStatements,
  assetGamestopBalanceStatements,
  assetBitcoinBalanceStatements,
  assetEthereumBalanceStatements,
  assetPokemonCardBalanceStatements,
  assetVehicleBalanceStatements,
} from './demoData/balanceStatements';

export const seedDemoData = async () => {
  // Account: Checking
  const accountChecking = await AccountRepository.createAccount(accountCheckingDetails);

  // Account: Checking (Transactions)
  for (let i = 0; i < 23; i++) {
    accountCheckingMonthlyTransactions(accountChecking.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Savings
  const accountSavings = await AccountRepository.createAccount(accountSavingsDetails);

  // Account: Savings (Transactions)
  for (let i = 0; i < 23; i++) {
    accountSavingsMonthlyTransactions(accountSavings.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Credit card
  const accountCreditCard = await AccountRepository.createAccount(accountCreditCardDetails);

  // Account: Credit card (Transactions)
  for (let i = 0; i < 23; i++) {
    accountCreditCardMonthlyTransactions(accountCreditCard.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Auto-loan
  await AccountRepository.createAccount({
    ...accountAutoLoanDetails,
    balanceStatements: accountAutoLoanBalanceStatements,
  });

  // Account: Roth IRA
  await AccountRepository.createAccount({
    ...accountRothIraDetails,
    balanceStatements: accountRothIraBalanceStatements,
  });

  // Account: 401K
  await AccountRepository.createAccount({
    ...account401kDetails,
    balanceStatements: account401kbalanceStatements,
  });

  // Account: Wallet
  await AccountRepository.createAccount({
    ...accountWalletDetails,
    balanceStatements: accountWalletBalanceStatements,
  });

  // Asset: Security (Tesla)
  await AssetRepository.createAsset({
    ...assetSecurityTeslaDetails,
    balanceStatements: assetTeslaBalanceStatements,
  });

  // Asset: Security (Gamestop)
  await AssetRepository.createAsset({
    ...assetSecurityGamestopDetails,
    balanceStatements: assetGamestopBalanceStatements,
  });

  // Asset: Crypto (Bitcoin)
  await AssetRepository.createAsset({
    ...assetCryptoBitcoinDetails,
    balanceStatements: assetBitcoinBalanceStatements,
  });

  // Asset: Crypto (Ethereum)
  await AssetRepository.createAsset({
    ...assetCryptoEthereumDetails,
    balanceStatements: assetEthereumBalanceStatements,
  });

  // Asset: Collectible
  await AssetRepository.createAsset({
    ...assetCollectibleDetails,
    balanceStatements: assetPokemonCardBalanceStatements,
  });

  // Asset: Vehicle
  await AssetRepository.createAsset({
    ...assetVehicleDetails,
    balanceStatements: assetVehicleBalanceStatements,
  });

  return true;
};

export default seedDemoData;
