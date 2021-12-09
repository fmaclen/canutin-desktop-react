import Section from '@app/components/common/Section';

import { Budget } from '@database/entities';

import CategoriesBudgetGroupTable from '../CategoriesBudgetGroupTable';
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
      <Section title="Categories by budget group">
        <CategoriesBudgetGroupTable expenseBudgets={expenseBudgets} />
      </Section>
    </>
  );
};

export default TransactionCategories;
