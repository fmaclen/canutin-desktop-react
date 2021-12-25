import { css } from 'styled-components';

import { grey10, redPlain } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

export const container = css<{ error: boolean }>`
  border-radius: 4px;
  border: 2px solid ${grey10};
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${monospaceRegular}
  font-size: 13px;

  ${({ error }) =>
    error &&
    css`
      color: ${redPlain};
      border: 2px solid ${redPlain};
    `}
`;
