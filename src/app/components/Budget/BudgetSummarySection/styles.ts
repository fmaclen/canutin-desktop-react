import { css } from 'styled-components';

import { grey40 } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const summaryDate = css`
  ${monospaceRegular};
  color: ${grey40};
  font-size: 12px;
  text-transform: uppercase;
  line-height: 1em;
  letter-spacing: 0.1em;
`;
