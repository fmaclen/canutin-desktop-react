import { css } from 'styled-components';
import { grey5, grey10 } from '@appConstants/colors';

export const container = css`
  border: none;
  border-bottom: 1px solid ${grey10};
  padding: 12px 0;
  display: grid;
  grid-row-gap: 8px;
  margin: 0;
  background-color: ${grey5};

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }
`;
