import { AssetPricesProps, RemoteAccountProps } from '@appTypes/canutinLink.type';

export const handleLinkAssets = (assets: AssetPricesProps[]) => {
  console.log('\n\n\n\n\n handleLinkAssets', assets);
};

export const handleLinkAccounts = (accounts: RemoteAccountProps[]) => {
  console.log('\n\n\n\n\n handleLinkAccounts', accounts);
};

export const handleLinkRemovedTransactions = (removedTransactions: string[]) => {
  console.log('\n\n\n\n\n handleLinkRemovedTransactions', removedTransactions);
};
