import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { AssetTypeEnum } from '../../enums/assetType.enum';
import { accountTypes } from '../../constants/accountTypes';

export const splitInChunks = (entityArray: any[]) => {
  // Splits arrays in chunks so they can be bulk inserted within the DB's driver limits
  const DATABASE_CHUNK_SIZE = 250;

  const chunks: any[] = [];
  for (let i = 0; i < entityArray.length; i += DATABASE_CHUNK_SIZE) {
    chunks.push(entityArray.slice(i, i + DATABASE_CHUNK_SIZE));
  }
  return chunks;
};

export const getBalanceGroupByAssetType = (assetType: AssetTypeEnum): BalanceGroupEnum => {
  let balanceGroup = BalanceGroupEnum.CASH;
  const cashBalanceGroup = [AssetTypeEnum.CASH];
  const investmentBalanceGroup = [AssetTypeEnum.SECURITY, AssetTypeEnum.CRYPTOCURRENCY];
  const otherBalanceGroup = [
    AssetTypeEnum.COLLECTIBLE,
    AssetTypeEnum.PRECIOUS_METAL,
    AssetTypeEnum.VEHICLE,
    AssetTypeEnum.REAL_STATE,
    AssetTypeEnum.BUSINESS,
    AssetTypeEnum.OTHER,
  ];

  if (cashBalanceGroup.map(values => values.toLowerCase()).includes(assetType))
    balanceGroup = BalanceGroupEnum.CASH;
  if (investmentBalanceGroup.map(values => values.toLowerCase()).includes(assetType))
    balanceGroup = BalanceGroupEnum.INVESTMENTS;
  if (otherBalanceGroup.map(values => values.toLowerCase()).includes(assetType))
    balanceGroup = BalanceGroupEnum.OTHER_ASSETS;

  return balanceGroup;
};

export const getBalanceGroupByAccountType = (accountType: string): BalanceGroupEnum => {
  let result: BalanceGroupEnum = BalanceGroupEnum.CASH;

  accountTypes.find(({ balanceGroup, accountTypes }) => {
    const found = accountTypes.find(({ value }) => value === accountType);
    if (found) result = balanceGroup;
  });

  return result;
};
