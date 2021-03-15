import { getRepository } from 'typeorm';
import { Asset, AssetType } from '../entities';

export class AssetRepository {
  static async createAsset() {
    const asset = await getRepository(Asset).save(new Asset('asd', 0, 0, 0, 0, new AssetType('CASH')));
    console.log(asset);
  }
}