import { css } from 'styled-components';
import { grey20, greenPlain } from '@appConstants/colors';

const statusBadgeSize = 6;

export const container = css<{ active: boolean }>`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    border-radius: 4px;
    width: ${statusBadgeSize}px;
    height: ${statusBadgeSize}px;
    top: 50%;
    left: -${statusBadgeSize * 2}px;
    transform: translateY(-50%);
    background-color: ${grey20};

    ${({ active }) =>
      active &&
      css`
        background-color: ${greenPlain};
      `};
  }
`;

export const icon = css`
  width: 18px;
  height: 18px;
`;
