import { bluePlain } from '@app/constants/colors';
import { css } from 'styled-components';

export const addAccountOrAssetSectionRow = css`
  grid-template-columns: 1fr 2fr 1fr;
`;

export const lightningPrimaryCard = css`
  > path {
    stroke: ${bluePlain};
  }
`;
