import React, { useEffect } from 'react';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';

import { Account } from '@database/entities';


import AccountEditBalanceForm from '../AccountEditBalanceForm';
import AccountEditDetailsForm from '../AccountEditDetailsForm';

interface AccountOverviewEditProps {
  account: Account;
}

const AccountOverviewEdit = ({ account }: AccountOverviewEditProps) => {
  const onRemove = () => {
    // TODO: Add on remove method
  }

  return (
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
  );
};

export default AccountOverviewEdit;
