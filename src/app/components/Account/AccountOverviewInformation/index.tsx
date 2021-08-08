import React from 'react';
import styled from 'styled-components';

import { Account, Transaction } from '@database/entities';

import Section from '@app/components/common/Section';
import TransactionsFilterTable from '@app/components/Transactions/TransactionsFilterTable';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface AccountOverviewInformationProps {
  account: Account;
  transactions: Transaction[];
}

const AccountOverviewInformation = ({ account, transactions }: AccountOverviewInformationProps) => {
  return (
    <Container>
      {account.transactions && (
        <Section title="Account transactions">
          <TransactionsFilterTable withoutGlobalFilters transactions={transactions} />
        </Section>
      )}
    </Container>
  );
};

export default AccountOverviewInformation;
