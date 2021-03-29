import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const container = css`
  background-color: ${grey5};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 12px;
  ${monospaceRegular};
`;
