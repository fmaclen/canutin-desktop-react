import { Account, Transaction } from '@database/entities';
import AccountIpc from '@app/data/account.ipc';

import { capitalize } from './strings.utils';

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
  transactions?: Transaction[];
}

export const createOrUpdateAccounts = (
  localAccounts: Account[],
  remoteAccounts: RemoteAccountProps[]
) => {
  // Loop through remote accounts
  remoteAccounts.forEach(async remoteAccount => {
    // Find an existing account with the same `linkId`
    const existingLinkedAccount = localAccounts.filter(
      localAccount => localAccount.linkId === remoteAccount.linkId
    )[0];

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
      await AccountIpc.createAccount({
        name: remoteAccount.name,
        accountType: remoteAccount.accountType,
        officialName: remoteAccount.officialName,
        institution: remoteAccount.institutionName,
        linkId: remoteAccount.linkId,
        balance: remoteAccount.balance,
        autoCalculate: remoteAccount.autoCalculate,
      });
    }

    // TODO: add transactions
  });
};
