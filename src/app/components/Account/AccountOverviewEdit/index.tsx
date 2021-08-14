import React, { useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';

import { Account } from '@database/entities';
import AccountIpc from '@app/data/account.ipc';
import { DB_GET_ACCOUNT_ACK } from '@constants/events';

import AccountEditBalanceForm from '../AccountEditBalanceForm';
import AccountEditDetailsForm from '../AccountEditDetailsForm';

interface AccountOverviewEditProps {
  temporalAccount: Account;
}

const AccountOverviewEdit = ({ temporalAccount }: AccountOverviewEditProps) => {
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    AccountIpc.getAccountById(temporalAccount.id);

    ipcRenderer.on(DB_GET_ACCOUNT_ACK, (_: IpcRendererEvent, { account: newAccount }) => {
      setAccount(newAccount);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNT_ACK);
    };
  }, []);

  const onRemove = () => {
    // TODO: Add on remove method
  };

  return account ? (
    <>
      <Section title="Account balance">
        <AccountEditBalanceForm account={account} />
      </Section>
      <Section title="Account details">
        <AccountEditDetailsForm account={account} />
      </Section>
      <RemoveSection
        confirmationMessage="Are you sure you want to remove this account?"
        onRemove={onRemove}
        removeMessage={
          <>
            Remove transaction <b>{account.name}</b>
          </>
        }
      />
    </>
  ) : null;
};

export default AccountOverviewEdit;
