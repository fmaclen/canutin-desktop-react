import { css } from 'styled-components';
import { greenPlain } from '@appConstants/colors';

const statusBadgeSize = 6;

export const container = css`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: ${greenPlain};
    border-radius: 4px;
    width: ${statusBadgeSize}px;
    height: ${statusBadgeSize}px;
    top: 50%;
    left: -${statusBadgeSize * 2}px;
    transform: translateY(-50%);
  }
`;

export const icon = css`
  width: 18px;
  height: 18px;
`;
