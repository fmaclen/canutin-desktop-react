import ScrollView from '@components/common/ScrollView';
import BudgetSummarySection from '@components/Budget/BudgetSummarySection';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';
import EmptyCard from '@app/components/common/EmptyCard';

import { Budget as BudgetEntity } from '@database/entities';
import ExpenseGroupsSection from '@app/components/Budget/ExpenseGroupsSection';
import useBudgetInfo from '@app/hooks/useBudgetInfo';

const Budget = () => {
  const {
    isLoading,
    targetExpenses,
    transactions,
    expenseBudgets,
    expenses,
    targetIncome,
    targetSavings,
    savings,
    budgetFilterOption,
    income,
  } = useBudgetInfo();

  return (
    <>
      <ScrollView
        title="Budget"
        headerNav={
          <BudgetHeaderButtons
            expenseBudgets={expenseBudgets as BudgetEntity[]}
            targetIncome={targetIncome}
            targetSavings={targetSavings}
          />
        }
      >
        {!isLoading && targetIncome !== null && transactions.length > 0 && (
          <>
            <BudgetSummarySection
              income={income}
              targetIncome={targetIncome}
              expenses={expenses}
              targetExpenses={targetExpenses}
              savings={savings}
              targetSavings={targetSavings}
              filter={budgetFilterOption}
            />
            {expenseBudgets && expenseBudgets.length > 0 && (
              <ExpenseGroupsSection expenseBudgets={expenseBudgets} transactions={transactions} />
            )}
          </>
        )}
        {!isLoading && transactions.length === 0 && (
          <EmptyCard message="No transactions were found in the chosen time period." />
        )}
      </ScrollView>
    </>
  );
};

export default Budget;
