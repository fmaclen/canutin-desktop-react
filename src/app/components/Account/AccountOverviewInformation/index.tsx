import React from 'react';

import { Account, Transaction } from '@database/entities';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';
import TransactionsFilterTable from '@app/components/Transactions/TransactionsFilterTable';
import { getTransactionBalanceByWeeks } from '@app/utils/balance.utils';

interface AccountOverviewInformationProps {
  account: Account;
  transactions: Transaction[];
}

const AccountOverviewInformation = ({ account, transactions }: AccountOverviewInformationProps) => (
  <>
    <Section title="Balance history">
      <Chart transactionData={getTransactionBalanceByWeeks(transactions, 53)} />
    </Section>
    {account.transactions && (
      <Section title="Account transactions">
        <TransactionsFilterTable withoutGlobalFilters transactions={transactions} />
      </Section>
    )}
  </>
);

export default AccountOverviewInformation;
