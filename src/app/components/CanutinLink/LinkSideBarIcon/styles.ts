import { css } from 'styled-components';
import { grey20, greenPlain, redPlain } from '@appConstants/colors';

import { StatusEnum } from '@app/constants/misc';

const statusBadgeSize = 6;

export const container = css<{ status: StatusEnum | null }>`
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

    ${({ status }) =>
      status === StatusEnum.POSITIVE &&
      css`
        background-color: ${greenPlain};
      `};

    ${({ status }) =>
      status === StatusEnum.NEGATIVE &&
      css`
        background-color: ${redPlain};
      `};
  }
`;

export const icon = css`
  width: 18px;
  height: 18px;
`;
