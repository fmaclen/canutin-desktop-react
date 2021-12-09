import styled from 'styled-components';

import NumberFormat from '@app/components/common/NumberFormat';

import { container, header, progress, progressContainer, balanceContainer } from './styles';

const Container = styled.div`
  ${container}
`;
const Header = styled.header`
  ${header}
`;
const ProgressContainer = styled.div`
  ${progressContainer}
`;

const Progress = styled.div`
  ${progress}
`;

const BalanceContainer = styled.div`
  ${balanceContainer}
`;

export enum BudgetProgressEnum {
  POSITIVE,
  NEGATIVE,
  NEUTRAL,
}

interface BudgetBarProps {
  title: string;
  amount: number;
  targetAmount: number;
}

const BudgetBar = ({
  title,
  amount,
  targetAmount
}: BudgetBarProps) => {
  const percentage = Math.abs(targetAmount === 0 ? amount : Math.floor((amount / targetAmount) * 100));

  const getStatus = () => {
    // TODO: Double check with @fmaclen

    if (percentage > 50) {
      return BudgetProgressEnum.NEGATIVE;
    }

    if (percentage > 70) {
      return BudgetProgressEnum.POSITIVE;
    }

    return BudgetProgressEnum.NEUTRAL;
  };

  return (
    <Container>
      <Header>
        <h2>{title}</h2>
      </Header>
      <ProgressContainer>
        <Progress percentage={percentage} status={getStatus()}>
          <div>
            <NumberFormat displayType={'text'} value={Math.round(amount)} />
            {` (${percentage}%)`}
          </div>
        </Progress>
      </ProgressContainer>
      <BalanceContainer>
        <NumberFormat
          displayType={'text'}
          value={targetAmount}
        />
      </BalanceContainer>
    </Container>
  );
};

export default BudgetBar;
