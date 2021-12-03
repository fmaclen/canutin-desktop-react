import { AccountRepository } from '@database/repositories/account.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

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

const seedDemoData = async () => {
  // Account: Checking
  const accountChecking = await AccountRepository.createAccount({
    name: "Alice's Checking",
    balanceGroup: BalanceGroupEnum.CASH,
    accountType: 'checking',
    autoCalculated: true,
    closed: false,
    officialName: 'Ransack High-Yield Checking',
    institution: 'Ransack Bank',
  });

  // Account: Checking (Transactions)
  for (let i = 0; i < 23; i++) {
    accountCheckingMonthlyTransactions(accountChecking.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Savings
  const accountSavings = await AccountRepository.createAccount({
    name: 'Emergency Fund',
    balanceGroup: BalanceGroupEnum.CASH,
    accountType: 'savings',
    autoCalculated: true,
    closed: false,
    officialName: 'Ransack Savings Plus',
    institution: 'Ransack Bank',
  });

  // Account: Savings (Transactions)
  for (let i = 0; i < 23; i++) {
    accountSavingsMonthlyTransactions(accountSavings.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Credit card
  const accountCreditCard = await AccountRepository.createAccount({
    name: "Bob's Juggernaut Visa",
    balanceGroup: BalanceGroupEnum.DEBT,
    accountType: 'credit card',
    autoCalculated: true,
    closed: false,
    officialName: 'Juggernaut Cash Back Rewards',
    institution: 'Juggernaut Bank',
  });

  // Account: Credit card (Transactions)
  for (let i = 0; i < 23; i++) {
    accountCreditCardMonthlyTransactions(accountCreditCard.id, i).forEach(async transaction => {
      await TransactionRepository.createTransaction(transaction);
    });
  }

  // Account: Auto-loan
  await AccountRepository.createAccount({
    name: 'Toyota Auto Loan',
    balanceGroup: BalanceGroupEnum.DEBT,
    accountType: 'auto',
    autoCalculated: false,
    closed: false,
    institution: 'Toyota Financial Services',
    balanceStatements: accountAutoLoanBalanceStatements,
  });

  // Account: Roth IRA
  await AccountRepository.createAccount({
    name: "Alice's Roth IRA",
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    accountType: 'roth',
    autoCalculated: false,
    closed: false,
    officialName: 'Loot Wealth Roth IRA',
    institution: 'Loot Financial',
    balanceStatements: accountRothIraBalanceStatements,
  });

  // Account: 401K
  await AccountRepository.createAccount({
    name: "Bob's 401k",
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    accountType: '401k',
    autoCalculated: false,
    closed: false,
    officialName: 'Loot Wealth 401k',
    institution: 'Loot Financial',
    balanceStatements: account401kbalanceStatements,
  });

  // Account: Wallet
  await AccountRepository.createAccount({
    name: 'Wallet',
    balanceGroup: BalanceGroupEnum.CASH,
    accountType: 'cash',
    autoCalculated: false,
    closed: false,
    balanceStatements: accountWalletBalanceStatements,
  });

  // Asset: Security (Tesla)
  await AssetRepository.createAsset({
    name: 'Tesla',
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetType: AssetTypeEnum.SECURITY,
    sold: false,
    symbol: 'TSLA',
    balanceStatements: assetTeslaBalanceStatements,
  });

  // Asset: Security (Gamestop)
  await AssetRepository.createAsset({
    name: 'GameStop',
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetType: AssetTypeEnum.SECURITY,
    sold: false,
    symbol: 'GME',
    balanceStatements: assetGamestopBalanceStatements,
  });

  // Asset: Crypto (Bitcoin)
  await AssetRepository.createAsset({
    name: 'Bitcoin',
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetType: AssetTypeEnum.CRYPTOCURRENCY,
    sold: false,
    symbol: 'BTC',
    balanceStatements: assetBitcoinBalanceStatements,
  });

  // Asset: Crypto (Ethereum)
  await AssetRepository.createAsset({
    name: 'Ethereum',
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetType: AssetTypeEnum.CRYPTOCURRENCY,
    sold: false,
    symbol: 'ETH',
    balanceStatements: assetEthereumBalanceStatements,
  });

  // Asset: Collectible
  await AssetRepository.createAsset({
    name: 'Pokemon Card Collection',
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetType: AssetTypeEnum.COLLECTIBLE,
    sold: false,
    balanceStatements: assetPokemonCardBalanceStatements,
  });

  // Asset: Vehicle
  await AssetRepository.createAsset({
    name: `${new Date().getFullYear()} Toyota RAV4`,
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetType: AssetTypeEnum.VEHICLE,
    sold: false,
    balanceStatements: assetVehicleBalanceStatements,
  });

  return true;
};

export default seedDemoData;
