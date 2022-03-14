import { css } from 'styled-components';

import { sansSerifBold } from '@appConstants/fonts';
import { grey40, grey20, grey30, grey70, bluePlain, whitePlain } from '@appConstants/colors';

export const container = css<{ appearance?: string; disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${bluePlain};
  border: none;
  border-radius: 4px;
  color: ${whitePlain};
  cursor: pointer;
  height: 40px;
  padding: 0 32px;
  transition: transform 100ms;

  &:focus {
    outline-color: ${bluePlain};
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}

  ${({ appearance }) =>
    appearance === 'secondary' &&
    css`
      color: ${grey40};
      background-color: transparent;
      border: 1px solid ${grey20};

      &:active,
      &:focus,
      &:hover {
        color: ${grey70};
        border-color: ${grey40};
      }
    `}
`;
