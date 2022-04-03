import AccountIpc from '@app/data/account.ipc';
import TransactionIpc from '@app/data/transaction.ipc';
import { Account } from '@database/entities';
import { RemoteAccountProps } from '@app/data/canutinLink.api';

import { dateInUTC } from './date.utils';
import { capitalize } from './strings.utils';

export const getAccountInformationLabel = (account: Account) => {
  if (account.institution) {
    return `${capitalize(account.institution)} / ${capitalize(account.accountType.name)} / Account`;
  }

  return `${capitalize(account.accountType.name)} / Account`;
};

export const handleLinkedAccounts = (
  remoteAccounts: RemoteAccountProps[],
  localAccounts?: Account[]
) => {
  // Loop through remote accounts
  remoteAccounts.forEach(async remoteAccount => {
    // Find an existing account with the same `linkId`
    const existingLinkedAccount = localAccounts?.filter(
      localAccount => 'toto' === remoteAccount.linkId
    )[0];
    // localAccounts?.filter(localAccount => localAccount.linkId === remoteAccount.linkId)[0];

    let accountId = (existingLinkedAccount && existingLinkedAccount.id) || 0;

    // Update existing account
    if (existingLinkedAccount) {
      const editBalanceFromLink = {
        balance: remoteAccount.balance,
        autoCalculated: remoteAccount.autoCalculate,
        closed: false,
      };

      // Create new balance statement
      existingLinkedAccount.id &&
        AccountIpc.editBalance({ ...editBalanceFromLink, accountId: existingLinkedAccount.id });
    } else {
      // Create new account
      // const newAccount = await AccountIpc.createLinkedAccount({
      //   name: remoteAccount.name,
      //   accountType: remoteAccount.accountType,
      //   officialName: remoteAccount.officialName,
      //   institution: remoteAccount.institutionName,
      //   balance: remoteAccount.balance,
      //   autoCalculate: remoteAccount.autoCalculate,
      // });
      const newAccount = await AccountIpc.createLinkedAccount({
        name: remoteAccount.name,
        balanceGroup: 0, // FIXME
        accountType: remoteAccount.accountType,
        officialName: remoteAccount.officialName,
        institution: remoteAccount.institutionName,
        autoCalculated: remoteAccount.autoCalculate, // FIXME: Rename to `autoCalculated`
        closed: false, // FIXME
      });

      // const newAccount = await AccountIpc.createLinkedAccount({
      //   name: remoteAccount.name,
      //   accountType: remoteAccount.accountType,
      //   officialName: remoteAccount.officialName,
      //   institution: remoteAccount.institutionName,
      //   linkId: remoteAccount.linkId,
      //   balance: remoteAccount.balance,
      //   autoCalculate: remoteAccount.autoCalculate,
      //   closed: remoteAccount.closed,
      // });

      accountId = newAccount.id;
    }

    // Add transactions
    remoteAccount.transactions?.forEach(async remoteTransaction => {
      // const transaction = {
      //   accountId: accountId,
      //   amount: remoteTransaction.amount,
      //   categoryName: remoteTransaction.categoryName,
      //   date: dateInUTC(new Date(remoteTransaction.date)),
      //   description: remoteTransaction.description,
      //   excludeFromTotals: remoteTransaction.excludeFromTotals,
      //   linkId: remoteTransaction.linkId,
      //   pending: remoteTransaction.pending,
      // };
      const transaction = {
        accountId: accountId,
        amount: remoteTransaction.amount,
        categoryName: remoteTransaction.categoryName,
        date: dateInUTC(new Date(remoteTransaction.date)),
        description: remoteTransaction.description,
        excludeFromTotals: remoteTransaction.excludeFromTotals,
        pending: remoteTransaction.pending,
      };

      TransactionIpc.addTransaction(transaction);
    });
  });
};
