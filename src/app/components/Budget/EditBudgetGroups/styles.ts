import { css } from 'styled-components';

export const buttonFieldContainer = css`
  display: grid;
  grid-template-columns: 3fr minmax(56px, 1fr);
  grid-gap: 8px;
`;

export const buttonFieldset = css`
  display: grid;
  grid-template-columns: 0.5fr minmax(32px, 1fr);
  min-height: 40px;
  grid-gap: 8px;
`;

export const percentageFieldContainer = css`
  display: grid;
  grid-template-columns: 9fr minmax(64px, 1fr);
  min-height: 40px;
  grid-gap: 8px;
`;
