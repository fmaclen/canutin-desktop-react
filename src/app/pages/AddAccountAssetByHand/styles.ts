import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const container = css`
  background-color: ${grey5};
  display: flex;
  height: calc(100vh - 250px);
`;

export const body = css`
  padding-top: 55px;
  padding-left: 130px;
  padding-right: 130px;
  width: 100%;
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 15px;
  ${monospaceRegular};
`;