import { useContext } from 'react';

import { EntitiesContext } from '@app/context/entitiesContext';
import { Budget as BudgetEntity } from '@database/entities';
import ExpenseGroupsSection from '@app/components/Budget/ExpenseGroupsSection';
import useBudgetInfo from '@app/hooks/useBudgetInfo';
import useBudgetData from '@app/hooks/useAutoBudget';

import ScrollView from '@components/common/ScrollView';
import BudgetSummarySection from '@components/Budget/BudgetSummarySection';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';
import EmptyCard from '@app/components/common/EmptyCard';
import useAutoBudget from '@app/hooks/useAutoBudget';

const Budget = () => {
  const { settingsIndex } = useContext(EntitiesContext);
  const autoBudget = settingsIndex?.settings.budgetAuto;

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
    targetIncomeTotal,
    targetExpensesTotal,
    targetSavingsTotal,
    periodIncomeTotal,
    periodExpensesTotal,
    periodSavingsTotal,
    periodExpenseGroups,
    isLoading,
  } = useAutoBudget();

  return (
    <>
      <ScrollView
        title="Budget"
        headerNav={
          <BudgetHeaderButtons
            expenseBudgets={expenseBudgets as BudgetEntity[]}
            targetIncome={targetIncomeTotal}
            targetSavings={targetSavingsTotal}
          />
        }
      >
        {!isLoading && targetIncomeTotal !== null && transactions.length > 0 && (
          <>
            <div>
              <h3>Income</h3>
              {periodIncomeTotal} of <strong>{targetIncomeTotal}</strong>
            </div>
            <div>
              <h3>Expenses</h3>
              {periodExpensesTotal} of <strong>{targetExpensesTotal}</strong>
            </div>
            <div>
              <h3>Savings</h3>
              {periodSavingsTotal} of <strong>{targetSavingsTotal}</strong>
            </div>
            <hr />
            <div>
              <h3>Groups</h3>
              {periodExpenseGroups.map(periodExpenseGroup => (
                <div>
                  {periodExpenseGroup.name}
                  <br />
                  {periodExpenseGroup.periodExpenseGruopTotal} of{' '}
                  <strong>{periodExpenseGroup.targetExpenseGroupTotal}</strong>
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
