import { BrowserWindow } from 'electron';

import { createdAtDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities/transaction.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import {
  CanutinFileTransactionType,
  CanutinFileType,
  UpdatedAccount,
} from '@appTypes/canutinFile.type';
import { LOADING_CSV } from '@constants/events';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { Account } from '@database/entities';

export const importFromCanutinFile = async (
  canutinFile: CanutinFileType,
  win: BrowserWindow | null
) => {
  try {
    const countAccounts = canutinFile.accounts?.length;

    canutinFile.accounts?.forEach(async canutinFileAccount => {
      // Find or create account
      const account = await AccountRepository.getOrCreateAccount(canutinFileAccount).then(res => {
        win?.webContents.send(LOADING_CSV, { total: countAccounts });
        return res;
      });

      // Process transactions
      canutinFileAccount.transactions &&
        handleCanutinFileTransactions(account, canutinFileAccount.transactions);

      return account;
    });

    canutinFile.assets &&
      (await Promise.all(
        canutinFile.assets.map(async canutinFileAsset =>
          AssetRepository.getOrCreateAsset({
            ...canutinFileAsset,
            assetType: canutinFileAsset.assetType as AssetTypeEnum,
          })
        )
      ));

    return true;
  } catch (error) {
    return false;
  }
};

// FIXME: I don't think we need a separate function to updateAccounts
export const updateAccounts = async (updatedAccounts: UpdatedAccount[]) => {
  updatedAccounts.forEach(async ({ id, transactions }) => {
    const account = await AccountRepository.getAccountById(id);

    account && transactions && handleCanutinFileTransactions(account, transactions);
  });
};

export const handleCanutinFileTransactions = async (
  account: Account,
  canutinFileTransactions: CanutinFileTransactionType[]
) => {
  const transactions = await Promise.all(
    canutinFileTransactions.map(async canutinFileTransaction => {
      const category = await CategoryRepository.getOrCreateSubCategory(
        canutinFileTransaction.category
      );

      return new Transaction(
        canutinFileTransaction.description,
        createdAtDate(canutinFileTransaction.date),
        canutinFileTransaction.amount,
        canutinFileTransaction.excludeFromTotals,
        account,
        category,
        createdAtDate(canutinFileTransaction.createdAt)
      );
    })
  );

  await TransactionRepository.createTransactions(transactions);
};
