import { useContext } from 'react';

import { EntitiesContext } from '@app/context/entitiesContext';
import useAutoBudget from '@app/hooks/useAutoBudget';

import ScrollView from '@components/common/ScrollView';
import Section from '@app/components/common/Section';
import EmptyCard from '@app/components/common/EmptyCard';
import BudgetBar from '@app/components/Budget/BudgetBar';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';

const Budget = () => {
  const { settingsIndex } = useContext(EntitiesContext);
  const autoBudget = settingsIndex?.settings.budgetAuto;

  const {
    targetIncomeTotal,
    targetExpensesTotal,
    targetSavingsTotal,
    periodIncomeTotal,
    periodExpensesTotal,
    periodSavingsTotal,
    periodExpenseGroups,
    periodTransactions,
    isLoading,
  } = useAutoBudget();

  return (
    <>
      <ScrollView
        title="Budget"
        subTitle={autoBudget ? 'Auto-budget' : 'Custom budget'}
        headerNav={<BudgetHeaderButtons />}
      >
        {!isLoading && targetIncomeTotal !== null && periodTransactions.length > 0 && (
          <>
            <Section title="Summary">
              <BudgetBar
                periodTotal={periodIncomeTotal}
                targetTotal={targetIncomeTotal}
                title="Income"
              />
              <BudgetBar
                periodTotal={periodExpensesTotal}
                targetTotal={targetExpensesTotal}
                title="Expenses"
              />
              <BudgetBar
                periodTotal={periodSavingsTotal}
                targetTotal={targetSavingsTotal}
                title="Savings"
              />
              {console.log(targetSavingsTotal)}
            </Section>
            {periodExpenseGroups.length > 0 && (
              <Section title="Expense groups">
                {periodExpenseGroups.map(expenseGroup => (
                  <BudgetBar
                    periodTotal={expenseGroup.periodExpenseGroupTotal}
                    targetTotal={expenseGroup.targetExpenseGroupTotal}
                    title={expenseGroup.name}
                  />
                ))}
              </Section>
            )}
          </>
        )}
        {!isLoading && periodTransactions.length === 0 && (
          <EmptyCard message="No transactions were found in the current period." />
        )}
      </ScrollView>
    </>
  );
};

export default Budget;
