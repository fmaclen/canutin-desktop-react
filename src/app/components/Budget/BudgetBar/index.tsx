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
  periodTotal: number;
  targetTotal: number;
}

const BudgetBar = ({ title, periodTotal, targetTotal }: BudgetBarProps) => {
  const percentage = Math.round(proportionBetween(periodTotal, targetTotal));

  const getBudgetStatus = () => {
    if (targetTotal > 0) {
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
            <NumberFormat displayType={'text'} value={Math.round(periodTotal)} />
            {` (${percentage}%)`}
          </ProgressTooltip>
        </Progress>
      </ProgressContainer>
      <BalanceContainer>
        <NumberFormat displayType={'text'} value={targetTotal} />
      </BalanceContainer>
    </Container>
  );
};

export default BudgetBar;
