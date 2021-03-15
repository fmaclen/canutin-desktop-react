import { css } from 'styled-components';
import { sansSerifBold, sansSerifRegular } from 'app/constants/fonts';
import { grey10, grey3, grey40 } from 'app/constants/colors';

export const container = css`
  height: 100%;

  -webkit-user-select: none;
`;

export const header = css`
  align-items: flex-start;
  background-color: ${grey3};
  border-bottom: 1px solid ${grey10};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 150px;
`;

export const title = css<{ subTitle: boolean }>`
  ${sansSerifBold};
  font-size: 24px;
  margin-left: 130px;
  padding-bottom: ${({ subTitle }) => subTitle ? '5px' : '25px'};
`;

export const subTitle = css`
  ${sansSerifRegular};
  color: ${grey40};
  font-size: 11px;
  margin-left: 130px;
  padding-bottom: 25px;
`;

export const body = css`
  height: 100%;
`;
