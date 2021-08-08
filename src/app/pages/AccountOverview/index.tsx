import React from 'react';
import { useLocation } from 'react-router-dom';

import { Account } from '@database/entities';
import { getAccountInformationLabel } from '@app/utils/account.utils';

import ScrollView from '@components/common/ScrollView';
import AccountOverviewHeader from '@components/Account/AccountOverviewHeader';
import AccountOverviewInformation from '@components/Account/AccountOverviewInformation';
import AccountOverviewEdit from '@components/Account/AccountOverviewEdit';

// TODO:
// - Generate transaction table
// - Balance history component
// - Edit tab

const AccountOverview = () => {
  const {
    state: { balance: account },
  } = useLocation<{ balance: Account }>();

  const accountOverviewSections = [
    {
      label: 'Overview',
      component: <AccountOverviewInformation account={account} />,
    },
    {
      label: 'Edit',
      component: <AccountOverviewEdit />
    }
  ];

  return (
    <>
      <ScrollView
        title={account.name}
        subTitle={getAccountInformationLabel(account)}
        headerNav={<AccountOverviewHeader />}
        sections={accountOverviewSections}
      />
    </>
  );
};

export default AccountOverview;
