import { useContext } from 'react';
import { format, getDaysInMonth, isThisMonth } from 'date-fns';
import styled from 'styled-components';

import { proportionBetween } from '@app/utils/balance.utils';
import { TransactionsContext } from '@app/context/transactionsContext';
import useBudget from '@app/hooks/useBudget';

import ScrollView from '@components/common/ScrollView';
import Section from '@app/components/common/Section';
import EmptyCard from '@app/components/common/EmptyCard';
import BudgetBar from '@app/components/Budget/BudgetBar';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';
import {
  currentPeriodDate,
  bugetThisMonthContainer,
  bugetThisMonthTime,
  bugetThisMonthLabel,
} from './styles';
import Card from '@app/components/common/Card';

const thisMonthDay = format(new Date(), 'dd');
const thisMonthPercentage = Math.round(
  proportionBetween(Number.parseInt(thisMonthDay), getDaysInMonth(new Date()))
);

const CurrentPeriodDate = styled.h2`
  ${currentPeriodDate}
`;
const BudgetThisMonthContainer = styled.div`
  ${bugetThisMonthContainer}
`;
const BudgetThisMonthTime = styled.time`
  ${bugetThisMonthTime}
`;
const BudgetThisMonthLabel = styled.span`
  ${bugetThisMonthLabel}
  width: ${thisMonthPercentage}%;
`;

const Budget = () => {
  const { budgetFilterOption } = useContext(TransactionsContext);

  const {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    periodIncomeAmount,
    periodExpensesAmount,
    periodSavingsAmount,
    periodOutOfBudgetAmount,
    periodExpenseGroups,
    periodTransactions,
    isLoading,
    autoBudget,
  } = useBudget();

  return (
    <>
      <ScrollView
        title="Budget"
        subTitle={autoBudget ? 'Auto-budget' : 'Custom budget'}
        headerNav={<BudgetHeaderButtons />}
      >
        <>
          {!isLoading && targetIncomeAmount > 0 && periodTransactions.length > 0 && (
            <BudgetThisMonthContainer>
              {isThisMonth(budgetFilterOption?.value?.dateFrom) && (
                <BudgetThisMonthTime>
                  <BudgetThisMonthLabel>{thisMonthDay}</BudgetThisMonthLabel>
                </BudgetThisMonthTime>
              )}

              <Section
                title="Summary"
                scope={
                  <CurrentPeriodDate>
                    {format(budgetFilterOption?.value?.dateFrom, 'MMM yyyy')}
                  </CurrentPeriodDate>
                }
              >
                <BudgetBar
                  periodAmount={periodIncomeAmount}
                  targetAmount={targetIncomeAmount}
                  title="Income"
                />
                <BudgetBar
                  periodAmount={periodExpensesAmount}
                  targetAmount={targetExpensesAmount}
                  title="Expenses"
                />
                <BudgetBar
                  periodAmount={periodSavingsAmount}
                  targetAmount={targetSavingsAmount}
                  title="Savings"
                />
              </Section>

              {periodExpenseGroups.length > 0 && (
                <Section title="Expenses by group">
                  {periodExpenseGroups.map(budgetGroup => (
                    <BudgetBar
                      key={budgetGroup.name}
                      title={budgetGroup.name}
                      periodAmount={budgetGroup.periodAmount}
                      targetAmount={budgetGroup.targetAmount}
                    />
                  ))}
                </Section>
              )}
            </BudgetThisMonthContainer>
          )}

          {periodOutOfBudgetAmount !== 0 && (
            <Section title="Other expenses">
              <Card label="Out of budget" value={periodOutOfBudgetAmount} isCurrency={true} />
            </Section>
          )}
        </>
        {!isLoading && periodTransactions.length === 0 && (
          <EmptyCard message="No transactions were found in the current period." />
        )}
      </ScrollView>
    </>
  );
};

export default Budget;
