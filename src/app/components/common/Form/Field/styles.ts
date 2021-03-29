import { css } from 'styled-components';
import { grey40, grey70 } from 'app/constants/colors';
import { sansSerifRegular, sansSerifBold } from 'app/constants/fonts';

export const container = css<{ disabled: boolean }>`
  display: grid;
  grid-template-columns: 1.25fr 2fr 0.75fr;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-top: 12px;
  padding-right: 20px;
  text-align: end;
`;

export const optionalTag = css`
  ${sansSerifRegular}
  color: ${grey40};
  font-size: 12px;
`;
