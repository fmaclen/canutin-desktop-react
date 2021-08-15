import { getRepository } from 'typeorm';

import { AssetTypeRepository } from '@database/repositories/assetTypes.repository';

import { Asset } from '../entities';
import { NewAssetType } from '../../types/asset.type';
import { AssetBalanceStatementRepository } from './assetBalanceStatement.entity';

export class AssetRepository {
  static async createAsset(asset: NewAssetType): Promise<Asset> {
    const assetType = await AssetTypeRepository.createOrGetAssetType({
      name: asset.assetType,
    });

    const savedAsset = await getRepository<Asset>(Asset).save(
      new Asset(asset.name, assetType, asset.symbol)
    );

    await AssetBalanceStatementRepository.createBalanceStatement({
      asset: savedAsset,
      sold: false,
      value: asset.value,
      cost: asset.cost,
      quantity: asset.quantity,
    });

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
}
