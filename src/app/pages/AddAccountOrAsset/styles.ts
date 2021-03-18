import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const section = css`
  align-items: center;
  background-color: ${grey5};
  display: grid;
  grid-auto-flow: column;
  grid-gap: 65px;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 15px;
  ${monospaceRegular};
`;

export const boxContainer = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`;