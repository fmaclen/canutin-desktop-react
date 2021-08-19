import React from 'react';
import styled from 'styled-components';

import { TransactionBalanceType } from '@app/utils/balance.utils';

import { container } from './styles';
import Card, { CardAppearanceEnum } from '../../Card';

const Container = styled.div`
  ${container}
`;

interface ChartSummaryProps {
  activeBalance: TransactionBalanceType;
  periodsLength: number;
}

const ChartSummary = ({ periodsLength, activeBalance }: ChartSummaryProps) => {
  return <Container periodsLength={periodsLength}>
    <Card
      label="Week"
      appearance={CardAppearanceEnum.SECONDARY}
      value={`${activeBalance.week} of ${activeBalance.dateWeek.getFullYear()}`}
    />
    <Card
      label="Difference"
      appearance={CardAppearanceEnum.SECONDARY}
      value={`${activeBalance.balance}%`}
    />
    <Card
      label="Balance"
      appearance={CardAppearanceEnum.SECONDARY}
      value={activeBalance.balance}
      isCurrency
    />
  </Container>
};

export default ChartSummary;
