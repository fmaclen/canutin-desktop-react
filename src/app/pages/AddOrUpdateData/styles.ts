import { css } from 'styled-components';
import { grey40, bluePlain } from '@appConstants/colors';
import { monospaceRegular } from '@appConstants/fonts';

export const section = css`
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 64px;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 12px;
  ${monospaceRegular};
`;

export const boxContainer = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
`;

export const lightningPrimaryCard = css`
  > path {
    stroke: ${bluePlain};
  }
`;
