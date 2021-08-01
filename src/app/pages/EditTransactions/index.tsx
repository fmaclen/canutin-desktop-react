import React from 'react';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import TransactionForm from '@components/Transactions/TransactionForm';

const EditTransactions = () => {
  
  return (
    <ScrollView title="Edit transaction">
      <Section title="Transaction details">
        <TransactionForm />
      </Section>
    </ScrollView>
  );
};

export default EditTransactions;
