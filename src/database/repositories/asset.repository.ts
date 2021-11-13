import { getRepository } from 'typeorm';

import { AssetTypeRepository } from '@database/repositories/assetTypes.repository';

import { Asset } from '../entities';
import {
  AssetEditDetailsSubmitType,
  AssetEditValueSubmitType,
  NewAssetType,
} from '../../types/asset.type';
import { AssetBalanceStatementRepository } from './assetBalanceStatement.entity';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { CanutinFileAssetBalanceStatementType } from '@appTypes/canutin';
import { createdAtDate } from '@app/utils/date.utils';

export class AssetRepository {
  static async createAsset(asset: NewAssetType): Promise<Asset> {
    const assetType = await AssetTypeRepository.createOrGetAssetType({
      name: asset.assetType,
    });

    const savedAsset = await getRepository<Asset>(Asset).save(
      new Asset(asset.name, assetType, asset.sold, asset.symbol)
    );

    // FIXME: duplicate of editValue()
    asset.balanceStatements?.forEach(
      async (
        balanceStatement: NewAssetBalanceStatementType | CanutinFileAssetBalanceStatementType
      ) => {
        await AssetBalanceStatementRepository.createBalanceStatement({
          asset: savedAsset,
          value: balanceStatement.value ? balanceStatement.value : 0,
          cost: balanceStatement.cost,
          quantity: balanceStatement.quantity,
          createdAt:
            typeof balanceStatement.createdAt === 'number'
              ? createdAtDate(balanceStatement.createdAt)
              : balanceStatement.createdAt,
        });
      }
    );

    return savedAsset;
  }

  static async getAssets(): Promise<Asset[]> {
    return await getRepository<Asset>(Asset).find({
      relations: ['assetType', 'balanceStatements'],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }

  static async getAssetById(assetId: number): Promise<Asset | undefined> {
    return await getRepository<Asset>(Asset).findOne(assetId, {
      relations: ['balanceStatements', 'assetType'],
    });
  }

  static async deleteAsset(assetId: number) {
    const asset = await getRepository<Asset>(Asset).findOne(Number(assetId), {
      relations: ['assetType', 'balanceStatements'],
    });

    asset?.balanceStatements &&
      (await AssetBalanceStatementRepository.deleteBalanceStatements(
        asset.balanceStatements.map(({ id }) => id)
      ));

    await getRepository<Asset>(Asset).delete(assetId);
  }

  static async editValue(assetValue: AssetEditValueSubmitType): Promise<Asset> {
    const asset = await getRepository<Asset>(Asset).findOne({
      where: {
        id: assetValue.assetId,
      },
    });

    // FIXME: duplicate of createAsset()
    asset?.balanceStatements?.forEach(async (balanceStatement: NewAssetBalanceStatementType) => {
      await AssetBalanceStatementRepository.createBalanceStatement({
        asset: asset,
        value: balanceStatement.value ? balanceStatement.value : 0,
        cost: balanceStatement.cost,
        quantity: balanceStatement.quantity,
        createdAt: balanceStatement.createdAt,
      });
    });

    return asset as Asset;
  }

  static async editDetails(assetValue: AssetEditDetailsSubmitType): Promise<Asset> {
    const assetType = await AssetTypeRepository.createOrGetAssetType({
      name: assetValue.assetType.toLowerCase() as AssetTypeEnum,
    });
    await getRepository<Asset>(Asset).update(assetValue.assetId, {
      assetType: assetType,
      balanceGroup: assetValue.balanceGroup,
      name: assetValue.name,
      symbol: assetValue.symbol,
    });

    const updatedAsset = await getRepository<Asset>(Asset).findOne({
      where: {
        id: assetValue.assetId,
      },
    });

    return updatedAsset as Asset;
  }

  static async getOrCreateAsset(asset: NewAssetType): Promise<Asset> {
    const assetDb = await getRepository<Asset>(Asset)
      .createQueryBuilder('assets')
      .leftJoinAndSelect('assets.balanceStatements', 'balanceStatements')
      .where('assets.name like :name', { name: `%${asset.name}%` })
      .getOne();

    if (!assetDb) {
      return AssetRepository.createAsset(asset);
    }

    return assetDb;
  }
}
