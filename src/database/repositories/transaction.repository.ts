import { getRepository, getConnection, Between, UpdateResult } from 'typeorm';
import { subMinutes } from 'date-fns';

import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

import { dateInUTC, handleDate } from '@app/utils/date.utils';
import { Transaction, Account } from '../entities';
import { AccountRepository } from './account.repository';
import { CategoryRepository } from './category.repository';
import { splitInChunks } from 'src/electron/helpers/database.helper';

export class TransactionRepository {
  static async createTransaction(transaction: NewTransactionType): Promise<Transaction> {
    const account = await AccountRepository.getAccountById(transaction.accountId);
    const category = await CategoryRepository.getSubCategory(transaction.categoryName);

    const newTransaction = await getRepository<Transaction>(Transaction).save(
      new Transaction(
        transaction.description as string,
        dateInUTC(transaction.date),
        transaction.amount,
        transaction.excludeFromTotals,
        transaction.pending,
        account as Account,
        category,
        handleDate(transaction.createdAt),
        transaction.importedAt
      )
    );

    return newTransaction;
  }

  static async editTransaction(transaction: NewTransactionType): Promise<UpdateResult> {
    const account = await AccountRepository.getAccountById(transaction.accountId);
    const category = await CategoryRepository.getSubCategory(transaction.categoryName);

    const newTransaction = await getRepository<Transaction>(Transaction).update(
      transaction.id as number,
      {
        account,
        amount: transaction.amount,
        category,
        date: dateInUTC(transaction.date),
        excludeFromTotals: transaction.excludeFromTotals,
        description: transaction.description as string,
      }
    );

    return newTransaction;
  }

  static async deleteTransaction(transactionId: number) {
    await getRepository<Transaction>(Transaction).delete(transactionId);
  }

  static async deleteTransactions(transactionsIds: number[]) {
    await getRepository<Transaction>(Transaction).delete(transactionsIds);
  }

  static async createTransactions(transactions: Transaction[]) {
    const transactionChunks: Transaction[][] = splitInChunks(transactions);

    transactionChunks.forEach(async transactionChunk => {
      try {
        const q = getRepository(Transaction).createQueryBuilder().insert().values(transactionChunk);
        const [sql, args] = q.getQueryAndParameters();
        const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO'); // Skips duplicate transactions

        return await getConnection().manager.query(nsql, args);
      } catch (e) {
        console.error(e);
      }
    });
  }

  static async getFilterTransactions(filter: FilterTransactionInterface): Promise<Transaction[]> {
    const dateFrom = subMinutes(
      dateInUTC(filter.dateFrom),
      dateInUTC(filter.dateFrom).getTimezoneOffset()
    );
    const dateTo = subMinutes(
      dateInUTC(filter.dateTo),
      dateInUTC(filter.dateTo).getTimezoneOffset()
    );

    return await getRepository<Transaction>(Transaction).find({
      relations: ['account', 'category'],
      order: { date: 'DESC' },
      where: {
        date: Between(dateFrom.toISOString(), dateTo.toISOString()),
      },
    });
  }
}
