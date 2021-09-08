import { css } from 'styled-components';

import { blackPlain, grey80, underline, underlineHover } from '@app/constants/colors';

export const container = css<{ disabled?: boolean }>`
  ${underline};
  color: ${grey80};
  font-size: 12px;
  text-decoration: none;

  &:hover {
    ${underlineHover}
    color: ${blackPlain};
    cursor: pointer;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: none;
      pointer-events: none;
    `}
`;
