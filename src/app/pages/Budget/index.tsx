import { useContext } from 'react';
import { format, getDaysInMonth, isThisMonth } from 'date-fns';
import styled from 'styled-components';

import { EntitiesContext } from '@app/context/entitiesContext';
import { TransactionsContext } from '@app/context/transactionsContext';
import useAutoBudget from '@app/hooks/useAutoBudget';
import { proportionBetween } from '@app/utils/balance.utils';

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
  const { settingsIndex } = useContext(EntitiesContext);
  const { budgetFilterOption } = useContext(TransactionsContext);
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
    periodOutOfBudgetTotal,
    isLoading,
  } = useAutoBudget();

  return (
    <>
      <ScrollView
        title="Budget"
        subTitle={autoBudget ? 'Auto-budget' : 'Custom budget'}
        headerNav={<BudgetHeaderButtons />}
      >
        <>
          {!isLoading && targetIncomeTotal > 0 && periodTransactions.length > 0 && (
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
              </Section>

              {periodExpenseGroups.length > 0 && (
                <Section title="Expenses by group">
                  {periodExpenseGroups.map(budgetGroup => (
                    <BudgetBar
                      key={budgetGroup.name}
                      title={budgetGroup.name}
                      periodTotal={budgetGroup.periodTotal}
                      targetTotal={budgetGroup.targetTotal}
                    />
                  ))}
                </Section>
              )}
            </BudgetThisMonthContainer>
          )}

          {periodOutOfBudgetTotal !== 0 && (
            <Section title="Other expenses">
              <Card label="Out of budget" value={periodOutOfBudgetTotal} isCurrency={true} />
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
