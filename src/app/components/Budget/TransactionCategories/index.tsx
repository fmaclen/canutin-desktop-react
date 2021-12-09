import Section from '@app/components/common/Section';

import { Budget } from '@database/entities';

import TransactionCategoriesForm from '../TransactionCategoriesForm';

interface TransactionCategoriesProps {
  expenseBudgets?: Budget[];
}

const TransactionCategories = ({ expenseBudgets }: TransactionCategoriesProps) => {
  return (
    <>
      <Section title="Transaction categories">
        <TransactionCategoriesForm expenseBudgets={expenseBudgets} />
      </Section>
      <Section title="Categories by budget group"></Section>
    </>
  );
};

export default TransactionCategories;
