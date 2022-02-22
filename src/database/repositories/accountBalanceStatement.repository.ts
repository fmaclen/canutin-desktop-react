import { getRepository, getConnection } from 'typeorm';

import { AccountBalanceStatement } from '../entities';
import { NewAccountBalanceStatementType } from '@appTypes/accountBalanceStatement.type';
import { splitInChunks } from '@database/connection';

export class AccountBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAccountBalanceStatementType
  ): Promise<AccountBalanceStatement> {
    return await getRepository<AccountBalanceStatement>(AccountBalanceStatement).save(
      new AccountBalanceStatement(
        balanceStatement.value,
        balanceStatement.account,
        balanceStatement.createdAt ? balanceStatement.createdAt : new Date()
      )
    );
  }

  static async createBalanceStatements(accountBalanceStatements: AccountBalanceStatement[]) {
    const balanceStatementChunks: AccountBalanceStatement[][] =
      splitInChunks(accountBalanceStatements);

    balanceStatementChunks.forEach(async balanceStatementChunk => {
      try {
        const q = getRepository(AccountBalanceStatement)
          .createQueryBuilder()
          .insert()
          .values(balanceStatementChunk);
        const [sql, args] = q.getQueryAndParameters();
        const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO'); // Skips duplicate accountBalanceStatements

        return await getConnection().manager.query(nsql, args);
      } catch (e) {
        console.error(e);
      }
    });
  }

  static async getBalanceStatements(): Promise<AccountBalanceStatement[]> {
    return await getRepository<AccountBalanceStatement>(AccountBalanceStatement).find({
      relations: ['account'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  static async deleteBalanceStatements(balanceStatementsIds: number[]) {
    await getRepository<AccountBalanceStatement>(AccountBalanceStatement).delete(
      balanceStatementsIds
    );
  }
}
