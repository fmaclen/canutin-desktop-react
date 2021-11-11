import { parse } from 'date-fns';
import { BrowserWindow } from 'electron';

import { dateInUTC, createdAtDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities/transaction.entity';
import { Budget } from '@database/entities/budget.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { CanutinFileType, UpdatedAccount } from '@appTypes/canutin';
import { LOADING_CSV } from '@constants/events';
import { CANUTIN_FILE_DATE_FORMAT } from '@constants';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { BalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';

export const importFromCanutinFile = async (
  canutinFile: CanutinFileType,
  win: BrowserWindow | null
) => {
  try {
    const countAccounts = canutinFile.accounts?.length;

    canutinFile.accounts?.forEach(async canutinFileAccount => {
      const account = await AccountRepository.getOrCreateAccount(canutinFileAccount).then(res => {
        win?.webContents.send(LOADING_CSV, { total: countAccounts });
        return res;
      });

      // Process transactions
      if (canutinFileAccount.transactions) {
        const transactions = await Promise.all(
          canutinFileAccount.transactions.map(async canutinFileTransaction => {
            const transactionDate = parse(
              canutinFileTransaction.date,
              CANUTIN_FILE_DATE_FORMAT,
              new Date()
            );
            const budget =
              canutinFileTransaction.budget &&
              new Budget(
                canutinFileTransaction.budget.name,
                canutinFileTransaction.budget.targetAmount,
                canutinFileTransaction.budget.type,
                parse(canutinFileTransaction.budget.date, CANUTIN_FILE_DATE_FORMAT, new Date())
              );
            const category = await CategoryRepository.getOrCreateSubCategory(
              canutinFileTransaction.category
            );
            return new Transaction(
              canutinFileTransaction.description,
              dateInUTC(transactionDate),
              canutinFileTransaction.amount,
              canutinFileTransaction.excludeFromTotals,
              account,
              category,
              createdAtDate(canutinFileTransaction.createdAt),
              budget
            );
          })
        );

        await TransactionRepository.createTransactions(transactions);
      }

      // Process balanceStatements
      canutinFileAccount.balanceStatements?.forEach(async canutinFileBalanceStatement => {
        console.log('creating:', canutinFileBalanceStatement);
        await BalanceStatementRepository.createBalanceStatement({
          createdAt: createdAtDate(canutinFileBalanceStatement.createdAt),
          value: canutinFileBalanceStatement.value,
          account: account,
        });
      });

      return account;
    });

    canutinFile.assets &&
      (await Promise.all(
        canutinFile.assets.map(async assetInfo =>
          AssetRepository.getOrCreateAsset({
            ...assetInfo,
            assetType: assetInfo.type as AssetTypeEnum,
          })
        )
      ));

    return true;
  } catch (error) {
    return false;
  }
};

export const updateAccounts = async (updatedAccounts: UpdatedAccount[]) => {
  updatedAccounts.forEach(async ({ id, transactions }) => {
    const account = await AccountRepository.getAccountById(id);

    if (account !== undefined) {
      const updatedTransactions = await Promise.all(
        transactions?.map(async transactionInfo => {
          const transactionDate = parse(transactionInfo.date, CANUTIN_FILE_DATE_FORMAT, new Date());
          const budget =
            transactionInfo.budget &&
            new Budget(
              transactionInfo.budget.name,
              transactionInfo.budget.targetAmount,
              transactionInfo.budget.type,
              parse(transactionInfo.budget.date, CANUTIN_FILE_DATE_FORMAT, new Date())
            );

          const category = await CategoryRepository.getOrCreateSubCategory(
            transactionInfo.category
          );
          return new Transaction(
            transactionInfo.description,
            dateInUTC(transactionDate),
            transactionInfo.amount,
            false,
            account,
            category,
            createdAtDate(transactionInfo.createdAt),
            budget
          );
        })
      );
      (await updatedTransactions) && TransactionRepository.createTransactions(updatedTransactions);
    }
  });
};
