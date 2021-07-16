import { css } from 'styled-components';
import { sansSerifBold } from '@appConstants/fonts';
import { whitePlain, shadowPlate } from '@appConstants/colors';

export const row = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`;

export const value = css<{ hasErrors?: boolean }>`
  ${row};
  ${sansSerifBold};
  align-items: center;
  box-shadow: ${shadowPlate};
  grid-template-columns: auto max-content;
  padding: 4px 4px 4px 8px;
  min-height: 40px;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 13px;
  background-color: ${whitePlain};
`;
