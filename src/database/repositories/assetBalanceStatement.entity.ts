import { getRepository } from 'typeorm';

import { Asset, AssetBalanceStatement } from '../entities';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { splitInChunks } from '@database/helpers';

interface UpdateAssetBalanceStatementType extends NewAssetBalanceStatementType {
  id: number;
  asset: Asset;
}

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
        await getRepository(AssetBalanceStatement)
          .createQueryBuilder()
          .insert()
          .orIgnore()
          .values(balanceStatementChunk)
          .execute();
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

  static async getBalanceStatement(id: number): Promise<AssetBalanceStatement | undefined> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).findOne(id, {
      relations: ['asset'],
    });
  }

  static async updateBalanceStatement(
    newBalanceStatementValues: UpdateAssetBalanceStatementType
  ): Promise<void> {
    const { value, quantity, cost } = newBalanceStatementValues;

    await getRepository<AssetBalanceStatement>(AssetBalanceStatement)
      .createQueryBuilder()
      .update(AssetBalanceStatement)
      .set({ value, quantity, cost })
      .where('id = :id', { id: newBalanceStatementValues.id })
      .execute();
  }

  static async deleteBalanceStatements(balanceStatementsIds: number[]) {
    await getRepository<AssetBalanceStatement>(AssetBalanceStatement).delete(balanceStatementsIds);
  }
}
