import styled from 'styled-components';
import { format } from 'date-fns';

import Section from '@app/components/common/Section';
import { SelectFieldValue } from '@app/components/common/Form/Select';

import { summaryDate } from './styles';
import BudgetBar from '../BudgetBar';

const SummaryDate = styled.h2`
  ${summaryDate}
`;

interface BudgetSummarySectionProps {
  income: number;
  targetIncome: number;
  expenses: number;
  targetExpenses: number;
  savings: number;
  targetSavings: number;
  filter: SelectFieldValue | null;
}

const BudgetSummarySection = ({
  expenses,
  income,
  savings,
  targetExpenses,
  targetIncome,
  targetSavings,
  filter,
}: BudgetSummarySectionProps) => {
  const summaryDate = <SummaryDate>{format(filter?.value?.dateFrom, 'MMM yyyy')}</SummaryDate>;

  return (
    <Section title="Summary" scope={summaryDate}>
      <BudgetBar amount={income} targetAmount={targetIncome} title="Income" />
      <BudgetBar amount={expenses} targetAmount={targetExpenses} title="Expenses" />
      <BudgetBar amount={savings} targetAmount={targetSavings} title="Savings" />
    </Section>
  );
};

export default BudgetSummarySection;
