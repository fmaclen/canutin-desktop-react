import styled, { css } from 'styled-components';

import NumberFormat from '@components/common/NumberFormat';

import { monospaceRegular } from '@app/constants/fonts';
import periodCurrentBackground from '@assets/icons/ChartCurrentBackground.svg';
import {
  greenLight,
  greenPlain,
  grey50,
  grey10,
  grey30,
  grey3,
  redLight,
  redPlain,
  whitePlain,
} from '@app/constants/colors';

export const Period = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px ${props => (props.theme.isStartOfYear ? `dashed ${grey30}` : `solid ${grey10}`)};
  border-bottom: 1px solid ${grey10};

  ${props =>
    props.theme.isActive &&
    css`
      position: relative;
      background-color: ${grey3};
      border-bottom-color: transparent;
    `}

  ${props =>
    props.theme.label === '1' &&
    css`
      border-left: 1px dashed ${grey30};
    `}

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }
`;

export const PeriodBalance = styled.div<{ proportion: string }>`
  display: grid;
  width: 100%;
  height: 50vh;
  min-height: 256px;
  max-height: 320px;
  padding-top: 8px;
  box-sizing: border-box;
  grid-template-rows: ${props => props.proportion};
`;

export const PeriodBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 28px;
`;

export const PeriodBalanceLabel = styled(NumberFormat)<{ isVisible: boolean }>`
  ${monospaceRegular};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 28px;
  font-size: 12px;
  text-align: center;
  color: ${props =>
    props.theme.balance > 0 ? greenPlain : props.theme.balance < 0 ? redPlain : grey50};
  margin: ${props => (props.theme.balance >= 0 ? 'auto 0 0 0' : '0 0 auto 0')};
  opacity: ${props => (props.theme.isActive ? 1 : props.isVisible ? 1 : 0)};
`;

export const Bar = styled.div<{ height: number }>`
  height: ${props => props.height}%;
`;

export const BarPositive = styled(Bar)`
  border-bottom: 1px solid ${grey10};

  ${props => {
    let background = css`
      background-color: ${greenLight};
    `;

    if (props.theme.isCurrentPeriod) {
      background = css`
        background-color: ${whitePlain};
        background-image: url('${periodCurrentBackground}');
        background-size: 40px;
      `;
    } else if (props.theme.isActive) {
      background = css`
        background-color: ${greenPlain};
      `;
    }
    return background;
  }}

  ${props =>
    props.theme.balance > 0 &&
    css`
      border-top: 3px solid ${greenPlain};
    `}
`;

export const BarNegative = styled(Bar)`
  margin-top: -1px; // Offseting the bar so it's border-top is aligned with the PositiveBar's border-bottom
  border-top: 1px solid ${grey10};
  border-bottom: 3px solid ${redPlain};

  ${props => {
    let background = css`
      color: ${redPlain};
      background-color: ${redLight};
    `;

    if (props.theme.isCurrentPeriod) {
      background = css`
        background-color: ${whitePlain};
        background-image: url('${periodCurrentBackground}');
        background-size: 40px;
      `;
    } else if (props.theme.isActive) {
      background = css`
        background-color: ${redPlain};
      `;
    }
    return background;
  }}
`;

// CSS HACK: we need an empty element to occupy the space allocated by <PeriodBalance/>'s grid-template-rows.
export const PeriodBarPlaceholder = styled.div`
  height: 28px;
`;

export const PeriodLabel = styled.time`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  font-size: ${props => (props.theme.isCompact ? '10px' : '11px')};
  line-height: 1em;
  padding: 12px 3px 8px;
  box-sizing: border-box;
  text-align: center;
  color: ${grey30};
`;
