import { Asset } from '@database/entities';
import AssetIpc from '@app/data/asset.ipc';
import { AssetEditValueSubmitType } from '@appTypes/asset.type';
import { getAssetByTypes } from '@app/utils/balance.utils';
import { AssetPricesProps } from '@app/data/canutinLink.api';

import { capitalize } from './strings.utils';

export const getAssetInformationLabel = (asset: Asset) => {
  if (asset.symbol) {
    return `${capitalize(asset.symbol)} / ${capitalize(asset.assetType.name)} / Asset`;
  }

  return `${capitalize(asset.assetType.name)} / Asset`;
};

export const uniqueUpatableAssetSymbols = (assets: Asset[]) => {
  const updatableAssets = assets && getAssetByTypes(['security', 'cryptocurrency'], assets);
  if (updatableAssets) {
    const symbols = updatableAssets.map(asset => asset.symbol);
    return updatableAssets
      .filter(({ symbol }, index) => {
        return !symbols.includes(symbol, index + 1);
      })
      .map(asset => ({
        symbol: asset.symbol,
        type: asset.assetType.name,
      }));
  }
};

export const newAssetBalanceStatement = (assets: Asset[], assetPrices: AssetPricesProps[]) => {
  assets.forEach(asset => {
    const lastBalanceStatement = asset.balanceStatements?.[asset.balanceStatements?.length - 1];

    const getPriceBySymbol = assetPrices.find(
      (assetPrice: AssetPricesProps) => assetPrice.symbol === asset.symbol && assetPrice
    );

    if (lastBalanceStatement && getPriceBySymbol) {
      const quantity = lastBalanceStatement.quantity ? lastBalanceStatement.quantity : 1;
      const assetEditValueSubmit: AssetEditValueSubmitType = {
        quantity: quantity,
        cost: getPriceBySymbol.latestPrice, // FIXME: this should be `price:`
        value: quantity * getPriceBySymbol.latestPrice,
        sold: lastBalanceStatement.sold,
        assetId: asset.id,
      };

      AssetIpc.editValue({ ...assetEditValueSubmit, assetId: asset.id });
    }
  });
};
