import { Account } from '@database/entities';
import { NewTransactionType } from '@appTypes/transaction.type';
import AccountIpc from '@app/data/account.ipc';
import TransactionIpc from '@app/data/transaction.ipc';

import { capitalize } from './strings.utils';
import { dateInUTC } from './date.utils';

export const getAccountInformationLabel = (account: Account) => {
  if (account.institution) {
    return `${capitalize(account.institution)} / ${capitalize(account.accountType.name)} / Account`;
  }

  return `${capitalize(account.accountType.name)} / Account`;
};

export interface RemoteAccountProps {
  accountType: string;
  autoCalculate: boolean;
  balance: number;
  balanceGroup: string;
  institutionName: string;
  linkId: string;
  name: string;
  officialName: string;
  transactions?: NewTransactionType[];
}

export const handleLinkedAccounts = (
  localAccounts: Account[],
  remoteAccounts: RemoteAccountProps[]
) => {
  // Loop through remote accounts
  remoteAccounts.forEach(async remoteAccount => {
    // Find an existing account with the same `linkId`
    const existingLinkedAccount = localAccounts.filter(
      localAccount => localAccount.linkId === remoteAccount.linkId
    )[0];

    let accountId = (existingLinkedAccount && existingLinkedAccount.id) || 0;

    // Update existing account
    if (existingLinkedAccount) {
      const editBalanceFromLink = {
        balance: remoteAccount.balance,
        autoCalculate: remoteAccount.autoCalculate,
        closed: false,
      };

      // Create new balance statement
      existingLinkedAccount.id &&
        AccountIpc.editBalance({ ...editBalanceFromLink, accountId: existingLinkedAccount.id });
    } else {
      // Create new account
      const newAccount = await AccountIpc.createLinkedAccount({
        name: remoteAccount.name,
        accountType: remoteAccount.accountType,
        officialName: remoteAccount.officialName,
        institution: remoteAccount.institutionName,
        linkId: remoteAccount.linkId,
        balance: remoteAccount.balance,
        autoCalculate: remoteAccount.autoCalculate,
      });

      accountId = newAccount.id;
    }

    // Add transactions
    remoteAccount.transactions?.forEach(async remoteTransaction => {
      const transaction = {
        accountId: accountId,
        amount: remoteTransaction.amount,
        categoryName: remoteTransaction.categoryName,
        date: dateInUTC(new Date(remoteTransaction.date)),
        description: remoteTransaction.description,
        excludeFromTotals: remoteTransaction.excludeFromTotals,
        linkId: remoteTransaction.linkId,
        pending: remoteTransaction.pending,
      };

      TransactionIpc.addTransaction(transaction);
    });
  });
};
