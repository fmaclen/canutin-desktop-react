import styled from 'styled-components';

import NumberFormat from '@app/components/common/NumberFormat';

import {
  container,
  header,
  progress,
  progressContainer,
  progressTooltip,
  balanceContainer,
} from './styles';
import { StatusEnum } from '@app/constants/misc';
import { proportionBetween } from '@app/utils/balance.utils';

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
const ProgressTooltip = styled.p`
  ${progressTooltip}
`;
const BalanceContainer = styled.div`
  ${balanceContainer}
`;

interface BudgetBarProps {
  title: string;
  periodAmount: number;
  targetAmount: number;
}

const BudgetBar = ({ title, periodAmount, targetAmount }: BudgetBarProps) => {
  const percentage = Math.round(proportionBetween(periodAmount, targetAmount));

  const getBudgetStatus = () => {
    if (targetAmount > 0) {
      // Budget bar with positive value
      if (percentage <= 20) {
        return StatusEnum.WARNING;
      } else if (percentage > 20 && percentage < 85) {
        return StatusEnum.NEUTRAL;
      } else {
        return StatusEnum.POSITIVE;
      }
    } else {
      // Budget bar with negative value
      return percentage < 100 ? StatusEnum.NEUTRAL : StatusEnum.NEGATIVE;
    }
  };

  return (
    <Container>
      <Header>{title}</Header>
      <ProgressContainer>
        <Progress percentage={percentage} status={getBudgetStatus()}>
          <ProgressTooltip>
            <NumberFormat displayType={'text'} value={Math.round(periodAmount)} />
            {` (${percentage}%)`}
          </ProgressTooltip>
        </Progress>
      </ProgressContainer>
      <BalanceContainer>
        <NumberFormat displayType={'text'} value={targetAmount} />
      </BalanceContainer>
    </Container>
  );
};

export default BudgetBar;
