import { getRepository, getConnection } from 'typeorm';

import { DATABASE_CHUNK_SIZE } from '@constants';
import { AssetBalanceStatement } from '../entities';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { splitInChunks } from 'src/electron/helpers/database.helper';

export class AssetBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAssetBalanceStatementType
  ): Promise<AssetBalanceStatement> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).save(
      new AssetBalanceStatement(
        balanceStatement.value,
        balanceStatement.asset,
        balanceStatement.createdAt,
        balanceStatement.quantity,
        balanceStatement.cost
      )
    );
  }

  static async createBalanceStatements(assetBalanceStatements: AssetBalanceStatement[]) {
    const balanceStatementChunks: AssetBalanceStatement[][] = splitInChunks(assetBalanceStatements);

    balanceStatementChunks.forEach(async balanceStatementChunk => {
      try {
        const q = getRepository(AssetBalanceStatement)
          .createQueryBuilder()
          .insert()
          .values(balanceStatementChunk);
        const [sql, args] = q.getQueryAndParameters();
        const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO'); // Skips duplicate assetBalanceStatements

        return await getConnection().manager.query(nsql, args);
      } catch (e) {
        console.error(e);
      }
    });
  }

  static async getBalanceStatements(): Promise<AssetBalanceStatement[]> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).find({
      relations: ['asset'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  static async deleteBalanceStatements(balanceStatementsIds: number[]) {
    await getRepository<AssetBalanceStatement>(AssetBalanceStatement).delete(balanceStatementsIds);
  }
}
