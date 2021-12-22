import styled from 'styled-components';

import NumberFormat from '@app/components/common/NumberFormat';

import { container, header, progress, progressContainer, balanceContainer } from './styles';
import { StatusEnum } from '@app/constants/misc';

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

interface BudgetBarProps {
  title: string;
  periodTotal: number;
  targetTotal: number;
}

const BudgetBar = ({ title, periodTotal, targetTotal }: BudgetBarProps) => {
  const percentage = Math.abs(
    targetTotal === 0 ? periodTotal : Math.floor((periodTotal / targetTotal) * 100)
  );

  const getStatus = () => {
    if (targetTotal > 0) {
      if (percentage <= 20) {
        return StatusEnum.WARNING;
      } else if (percentage > 20 && percentage < 85) {
        return StatusEnum.NEUTRAL;
      } else {
        return StatusEnum.POSITIVE;
      }
    } else {
      return percentage < 100 ? StatusEnum.NEUTRAL : StatusEnum.NEGATIVE;
    }
  };

  return (
    <Container>
      <Header>
        <h2>{title}</h2>
      </Header>
      <ProgressContainer>
        <Progress percentage={percentage} status={getStatus()}>
          <div>
            <NumberFormat displayType={'text'} value={Math.round(periodTotal)} />
            {` (${percentage}%)`}
          </div>
        </Progress>
      </ProgressContainer>
      <BalanceContainer>
        <NumberFormat displayType={'text'} value={targetTotal} />
      </BalanceContainer>
    </Container>
  );
};

export default BudgetBar;
