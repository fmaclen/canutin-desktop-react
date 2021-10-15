import { css } from 'styled-components';
import { whitePlain } from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';
import { CardAppearanceEnum } from '../Card';

export const frame = css`
  background-color: ${whitePlain};
  border-radius: 5px;
  width: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05), 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

export const value = css<{ appearance?: CardAppearanceEnum }>`
  ${monospaceRegular}
  font-size: 14px;
`;
