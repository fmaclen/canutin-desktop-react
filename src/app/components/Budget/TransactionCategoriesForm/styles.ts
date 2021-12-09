import { css } from 'styled-components';

import { borderGrey, grey10, grey40 } from '@app/constants/colors';

export const disabledField = css`
  background-color: ${grey10};
  border: 2px solid ${borderGrey};
  border-radius: 4px;
  font-size: 13px;
  color: ${grey40};
  padding: 12px;
`