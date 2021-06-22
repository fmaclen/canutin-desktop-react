import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey70 } from '@appConstants/colors';

export const container = css`
  ${sansSerifBold};
  cursor: pointer;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 3px;
  color: ${grey70};
  border: 1px solid ${grey20};
  background-color: transparent;
  line-height: 1em;
  transition: transform 100ms;

  &:hover {
    border-color: ${grey70};
  }

  &:active {
    transform: scale(0.98);
  }
`;
