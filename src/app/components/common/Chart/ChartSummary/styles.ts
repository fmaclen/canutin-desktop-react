import { css } from 'styled-components';

import { borderGrey, grey3, shadowPlate } from '@app/constants/colors';

export const container = css`
  background-color: ${grey3};
  box-shadow: ${shadowPlate};
  border-top: 1px solid ${borderGrey};
  border-radius: 0 0 5px 5px;
  list-style: none;
  display: grid;
  margin: 0;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  padding: 16px;
`;
