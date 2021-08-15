import { AssetTypeEnum } from '../enums/assetType.enum';

export type NewAssetType = {
  name: string;
  quantity?: number;
  cost?: number;
  value?: number;
  assetType: AssetTypeEnum;
  symbol?: string;
};

export type AssetEditValueSubmitType = {
  quantity?: number;
  cost?: number;
  value: number;
  sold: boolean;
  assetId: number;
};