import Section from '@app/components/common/Section';

import { Budget } from '@database/entities';

import CategoriesTable from '../CategoriesTable';
import TransactionCategoriesForm from '../TransactionCategoriesForm';

interface TransactionCategoriesProps {
  expenseBudgets?: Budget[];
}

const TransactionCategories = ({ expenseBudgets }: TransactionCategoriesProps) => {
  return (
    <>
      <Section title="Manage categories">
        <TransactionCategoriesForm expenseBudgets={expenseBudgets} />
      </Section>
      <Section title="Categories by expense group">
        <CategoriesTable expenseBudgets={expenseBudgets} />
      </Section>
    </>
  );
};

export default TransactionCategories;
