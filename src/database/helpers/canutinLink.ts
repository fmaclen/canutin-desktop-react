import { Asset } from '@database/entities';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetPricesProps } from '@appTypes/canutinLink.type';
import { AssetBalanceStatementRepository } from '@database/repositories/assetBalanceStatement.entity';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { AccountRepository } from '@database/repositories/account.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import {
  CanutinFileAccountBalanceStatementType,
  CanutinFileAccountType,
} from '@appTypes/canutinFile.type';
import { createTransactionsFromCanutinFile } from './importSource';

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
        const { quantity, id } = asset.balanceStatements[asset.balanceStatements.length - 1];

        const updatedBalanceStatementValues = {
          asset: asset,
          createdAt: new Date(),
          id: id,
          value: quantity * assetPrice.latestPrice,
          quantity: quantity,
          cost: assetPrice.latestPrice,
        };

        await AssetBalanceStatementRepository.createBalanceStatement(updatedBalanceStatementValues);

        return asset;
      }
    });
    return updatedAssets;
  });
};

export const handleLinkAccounts = (remoteAccounts: CanutinFileAccountType[]) => {
  const updatedAccounts = remoteAccounts.map(async remoteAccount => {
    const { autoCalculated, closed, linkId, balanceStatements } = remoteAccount;
    const value = balanceStatements?.[0].value || 0;
    let account = linkId && (await AccountRepository.getAccountByLinkId(linkId));

    if (account) {
      // Editing existing account
      await AccountRepository.editBalance({
        accountId: account.id,
        balance: value,
        autoCalculated,
        closed,
      });
    } else {
      // Creating new account
      const remoteAccountBalanceStatement: CanutinFileAccountBalanceStatementType = {
        createdAt: Date.now() / 1000,
        value,
      };

      account = await AccountRepository.createAccount({
        ...remoteAccount,
        balanceStatements: [remoteAccountBalanceStatement],
      });
    }

    // Create transactions
    remoteAccount.transactions &&
      (await createTransactionsFromCanutinFile(account, remoteAccount.transactions));
  });
  return updatedAccounts;
};

export const handleLinkRemovedTransactions = (removedTransactions: string[]) => {
  removedTransactions.map(async transactionLinkId => {
    const transaction = await TransactionRepository.findTransactionByLinkId(transactionLinkId);
    transaction && (await TransactionRepository.deleteTransaction(transaction.id));
  });
};
