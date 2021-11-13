import { getRepository, getConnection } from 'typeorm';

import { BalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { AccountTypeRepository } from '@database/repositories/accountType.repository';

import { Account } from '../entities';
import {
  NewAccountType,
  AccountEditBalanceSubmitType,
  AccountEditDetailsSubmitType,
} from '../../types/account.type';
import { TransactionRepository } from './transaction.repository';
import { createdAtDate } from '@app/utils/date.utils';

export class AccountRepository {
  static async createAccount(account: NewAccountType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: account.accountType.toLowerCase(),
    });

    const accountSaved = await getRepository<Account>(Account).save(
      new Account(
        account.name,
        account.closed,
        account.autoCalculated,
        accountType,
        account.officialName,
        account.institution
      )
    );

    // FIXME: this logic is duplicated for `getOrCreateAccount()`
    if (!account.autoCalculated && account.balanceStatements) {
      account.balanceStatements.forEach(async (balanceStatement: any) => {
        await BalanceStatementRepository.createBalanceStatement({
          createdAt: createdAtDate(balanceStatement.createdAt),
          value: balanceStatement.value ? balanceStatement.value : 0,
          account: accountSaved,
        });
      });
    } else if (!account.autoCalculated) {
      await BalanceStatementRepository.createBalanceStatement({
        createdAt: new Date(),
        value: 0,
        account: accountSaved,
      });
    }

    return accountSaved;
  }

  static async createAccounts(accounts: Account[]): Promise<Account[]> {
    const accountsLowerCase = accounts.map(account => ({
      ...account,
    }));
    const q = getRepository(Account).createQueryBuilder().insert().values(accountsLowerCase);
    const [sql, args] = q.getQueryAndParameters();
    const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO');

    return await getConnection().manager.query(nsql, args);
  }

  static async getAccounts(): Promise<Account[]> {
    return await getRepository<Account>(Account).find({
      relations: [
        'transactions',
        'transactions.account',
        'transactions.category',
        'balanceStatements',
        'accountType',
      ],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }

  static async getAccountById(accountId: number): Promise<Account | undefined> {
    return await getRepository<Account>(Account).findOne(accountId, {
      relations: [
        'transactions',
        'transactions.account',
        'transactions.category',
        'balanceStatements',
        'accountType',
      ],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }

  static async getOrCreateAccount(account: NewAccountType): Promise<Account> {
    const existingAccount = await getRepository<Account>(Account)
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.balanceStatements', 'balanceStatements')
      .where('account.name like :name', { name: `%${account.name}%` })
      .getOne();

    if (!existingAccount) {
      return AccountRepository.createAccount(account);
    }

    // FIXME: this logic is duplicated for `createAccount()`
    if (!account.autoCalculated && account.balanceStatements) {
      account.balanceStatements.forEach(async (balanceStatement: any) => {
        await BalanceStatementRepository.createBalanceStatement({
          createdAt: createdAtDate(balanceStatement.createdAt),
          value: balanceStatement.value ? balanceStatement.value : 0,
          account: existingAccount,
        });
      });
    } else if (!account.autoCalculated) {
      await BalanceStatementRepository.createBalanceStatement({
        createdAt: new Date(),
        value: 0,
        account: existingAccount,
      });
    }

    return existingAccount;
  }

  static async editBalance(accountBalance: AccountEditBalanceSubmitType): Promise<Account> {
    await getRepository<Account>(Account).update(accountBalance.accountId, {
      autoCalculated: accountBalance.autoCalculated,
      closed: accountBalance.closed,
    });

    const updatedAccount = await getRepository<Account>(Account).findOne({
      where: {
        id: accountBalance.accountId,
      },
    });

    // FIXME: this logic is duplicated for `createAccount() and getOrCreateAccount()`
    !accountBalance.autoCalculated &&
      (await BalanceStatementRepository.createBalanceStatement({
        createdAt: new Date(),
        value: accountBalance.balance,
        account: updatedAccount as Account,
      }));

    return updatedAccount as Account;
  }

  static async editDetails(accountDetails: AccountEditDetailsSubmitType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: accountDetails.accountTypeName.toLowerCase(),
    });
    await getRepository<Account>(Account).update(accountDetails.accountId, {
      name: accountDetails.name,
      balanceGroup: accountDetails.balanceGroup,
      institution: accountDetails.institution,
      accountType,
    });

    const updatedAccount = await getRepository<Account>(Account).findOne({
      where: {
        id: accountDetails.accountId,
      },
      relations: ['accountType'],
    });

    return updatedAccount as Account;
  }

  static async deleteAccount(accountId: number) {
    const account = await getRepository<Account>(Account).findOne(Number(accountId), {
      relations: ['transactions', 'balanceStatements'],
    });

    // Delete associated transactions
    account?.transactions &&
      account.transactions.length > 0 &&
      (await TransactionRepository.deleteTransactions(account.transactions.map(({ id }) => id)));

    // Delete associated balance statements
    !account?.autoCalculated &&
      account?.balanceStatements &&
      (await BalanceStatementRepository.deleteBalanceStatements(
        account.balanceStatements.map(({ id }) => id)
      ));

    await getRepository<Account>(Account).delete(accountId);
  }
}
