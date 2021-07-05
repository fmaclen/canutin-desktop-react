import { AssetTypeEnum } from '../enums/assetType.enum'
import { BalanceGroupEnum } from '../enums/balanceGroup.enum';

export const assetTypes = [
  {
    balanceGroup: BalanceGroupEnum.CASH,
    assetTypes: [
      {
        label: AssetTypeEnum.CASH,
        value: 'cash',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.INVESTMENT,
    assetTypes: [
      {
        label: AssetTypeEnum.SECURITY,
        value: 'security',
      },
      {
        label: AssetTypeEnum.CRYPTOCURRENCY,
        value: 'cryptocurrency',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetTypes: [
      {
        label: AssetTypeEnum.COLLECTIBLE,
        value: 'collectible',
      },
      {
        label: AssetTypeEnum.PRECIOUS_METAL,
        value: 'precious metal',
      },
      {
        label: AssetTypeEnum.VEHICLE,
        value: 'vehicle',
      },
      {
        label: AssetTypeEnum.REAL_STATE,
        value: 'real state',
      },
      {
        label: AssetTypeEnum.BUSINESS,
        value: 'business',
      },
      {
        label: AssetTypeEnum.OTHER,
        value: 'other',
      },
    ],
  },
];

export const assetTypesWithSymbol = ['cryptocurrency', 'precious metal', 'security'];
