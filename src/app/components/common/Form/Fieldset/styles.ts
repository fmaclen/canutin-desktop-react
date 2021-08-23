import { css } from 'styled-components';
import { grey5, grey10 } from '@appConstants/colors';

export const container = css`
  border: none;
  background-color: ${grey5};
  border-top: 1px solid ${grey10};
  padding: 12px 0;
  display: grid;
  grid-row-gap: 8px;
  margin: 0;

  &:first-child {
    border-top: none;
  }
`;
