import { differenceInHours } from 'date-fns';

import { Asset } from '@database/entities';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetPricesProps, RemoteAccountProps } from '@appTypes/canutinLink.type';
import { AssetBalanceStatementRepository } from '@database/repositories/assetBalanceStatement.entity';
import { AssetTypeEnum } from '@enums/assetType.enum';

export const handleLinkAssets = async (assetPrices: AssetPricesProps[]) => {
  let updatedAssets: Asset[];

  return await AssetRepository.getAssets().then(assets => {
    updatedAssets = assets?.filter(async asset => {
      const assetPrice = assetPrices.find(
        assetPrice => assetPrice.symbol === asset.symbol && assetPrice
      );

      if (
        !assetPrice ||
        asset.sold ||
        (asset.assetType.name !== AssetTypeEnum.SECURITY &&
          asset.assetType.name !== AssetTypeEnum.CRYPTOCURRENCY)
      )
        return false;

      if (assetPrice && asset.balanceStatements) {
        const lastBalanceStatement = asset.balanceStatements[asset.balanceStatements.length - 1];
        const { quantity = 0 } = lastBalanceStatement;

        const isOlderThan12hs = differenceInHours(new Date(), lastBalanceStatement.createdAt) > 12;

        const updatedBalanceStatementValues = {
          asset: asset,
          id: lastBalanceStatement.id,
          createdAt: isOlderThan12hs ? new Date() : asset.createdAt,
          value: quantity * assetPrice.latestPrice,
          quantity: quantity,
          cost: assetPrice.latestPrice,
        };

        isOlderThan12hs
          ? await AssetBalanceStatementRepository.createBalanceStatement(
              updatedBalanceStatementValues
            )
          : await AssetBalanceStatementRepository.updateBalanceStatement(
              updatedBalanceStatementValues
            );
      }
      return asset;
    });
    return updatedAssets;
  });
};

export const handleLinkAccounts = (accounts: RemoteAccountProps[]) => {
  console.log('\n\n\n\n\n handleLinkAccounts', accounts);
};

export const handleLinkRemovedTransactions = (removedTransactions: string[]) => {
  console.log('\n\n\n\n\n handleLinkRemovedTransactions', removedTransactions);
};
