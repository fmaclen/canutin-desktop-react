import { css } from 'styled-components';

import { sansSerifRegular } from '@app/constants/fonts';
import { blackPlain, grey80, underline, underlineHover } from '@app/constants/colors';

export const container = css`
  ${sansSerifRegular}
  ${underline};
  color: ${grey80};
  font-size: 12px;
  text-decoration: none;
  padding: 0;
  border: none;
  background-color: transparent;

  &:hover {
    ${underlineHover}
    color: ${blackPlain};
    cursor: pointer;
  }
`;
