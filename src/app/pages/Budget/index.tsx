import ScrollView from '@components/common/ScrollView';
import BudgetSummarySection from '@components/Budget/BudgetSummarySection';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';
import EmptyCard from '@app/components/common/EmptyCard';

import { Budget as BudgetEntity } from '@database/entities';
import ExpenseGroupsSection from '@app/components/Budget/ExpenseGroupsSection';
import useBudgetInfo from '@app/hooks/useBudgetInfo';
import useBudgetData from '@app/hooks/useBudgetData';

const Budget = () => {
  const {
    // isLoading,
    // targetExpenses,
    transactions,
    expenseBudgets,
    expenses,
    // targetIncome,
    // targetSavings,
    savings,
    budgetFilterOption,
    income,
  } = useBudgetInfo();

  const {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    periodIncomeAmount,
    periodExpensesAmount,
    periodSavingsAmount,
    periodExpenseGroups,
    isLoading,
  } = useBudgetData();

  return (
    <>
      <ScrollView
        title="Budget"
        headerNav={
          <BudgetHeaderButtons
            expenseBudgets={expenseBudgets as BudgetEntity[]}
            targetIncome={targetIncomeAmount}
            targetSavings={targetSavingsAmount}
          />
        }
      >
        {!isLoading && targetIncomeAmount !== null && transactions.length > 0 && (
          <>
            <div>
              <h3>Income</h3>
              {periodIncomeAmount} of <strong>{targetIncomeAmount}</strong>
            </div>
            <div>
              <h3>Expenses</h3>
              {periodExpensesAmount} of <strong>{targetExpensesAmount}</strong>
            </div>
            <div>
              <h3>Savings</h3>
              {periodSavingsAmount} of <strong>{targetSavingsAmount}</strong>
            </div>
            <hr />
            <div>
              <h3>Groups</h3>
              {periodExpenseGroups.map(periodExpenseGroup => (
                <div>
                  {periodExpenseGroup.name}
                  <br />
                  {periodExpenseGroup.periodExpenseGruopAmount} of{' '}
                  <strong>{periodExpenseGroup.targetExpenseGroupAmount}</strong>
                </div>
              ))}
            </div>
            {/* <BudgetSummarySection
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
            )} */}
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
