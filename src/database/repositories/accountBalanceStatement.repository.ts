import { getRepository } from 'typeorm';

import { AccountBalanceStatement } from '../entities';
import { NewBalanceStatementType } from '@appTypes/accountBalanceStatement.type';

export class BalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewBalanceStatementType
  ): Promise<AccountBalanceStatement> {
    return await getRepository<AccountBalanceStatement>(AccountBalanceStatement).save(
      new AccountBalanceStatement(
        balanceStatement.account,
        balanceStatement.createdAt ? balanceStatement.createdAt : new Date(),
        balanceStatement.value
      )
    );
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
