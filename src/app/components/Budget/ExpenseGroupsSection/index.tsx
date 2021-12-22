import Section from '@app/components/common/Section';
import { Budget, Transaction } from '@database/entities';
import BudgetBar from '../BudgetBar';

interface ExpenseGroupsSectionProps {
  expenseBudgets: Budget[];
  transactions: Transaction[];
}

const ExpenseGroupsSection = ({ expenseBudgets, transactions }: ExpenseGroupsSectionProps) => {
  return (
    <Section title="Expense Groups">
      {/* {expenseBudgets.map(({ categories, targetAmount, id, name }) => {
        const amount = transactions
          .filter(({ category }) => categories.some(({ id }) => id === category.id))
          .reduce((accAmount, { amount }) => {
            return accAmount + amount;
          }, 0);

        return <BudgetBar amount={amount} targetAmount={targetAmount} title={name} key={id} />;
      })} */}
    </Section>
  );
};

export default ExpenseGroupsSection;
