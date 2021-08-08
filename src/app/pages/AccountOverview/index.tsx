import React from 'react';
import { useLocation } from 'react-router-dom';

import { Account } from '@database/entities';

import ScrollView from '@components/common/ScrollView';
import TransactionsHeaderButtons from '@app/components/Transactions/TransactionsHeaderButtons';

// TODO:
// - Create header Nav
// - Create tab component
// - Generate transaction table
// - Balance history component
// - Edit tab

const AccountOverview = () => {
  const {
    state: { balance: account },
  } = useLocation<{ balance: Account }>();

  return (
    <>
      <ScrollView title={account.name} headerNav={<TransactionsHeaderButtons />}>
      </ScrollView>
    </>
  );
};

export default AccountOverview;
