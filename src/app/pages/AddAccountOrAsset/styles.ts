import { css } from 'styled-components';
import { grey40, grey5 } from 'app/constants/colors';
import { monospaceRegular } from 'app/constants/fonts';

export const body = css`
  align-items: center;
  background-color: ${grey5};
  display: flex;
  justify-content: center;
  height: calc(100vh - 250px);
`;

export const subTitle = css`
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 15px;
  ${monospaceRegular};
`;

export const boxContainer = css`
  display: flex;
`;

export const styledSetupOptionBox = css`
  width: 220px;
`;

export const subDivision = css`
  padding-left: 65px;
`;