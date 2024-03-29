import { css } from 'styled-components';

import {
  grey5,
  grey20,
  grey3,
  grey30,
  grey80,
  shadowPlate,
  whitePlain,
  yellowUnderline,
  blackPlain,
  yellowUnderlineHover,
} from '@app/constants/colors';
import { monospaceRegular } from '@app/constants/fonts';

const borderRadius = '4px';

export const container = css`
  background-color: ${whitePlain};
  box-shadow: ${shadowPlate};
  border-radius: ${borderRadius};
  display: flex;
  flex-direction: column;
`;

export const balanceTypeCardContainer = css`
  align-items: center;
  border-bottom: 1px dashed ${grey20};
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto max-content;
  padding: 16px;
`;

export const balanceItemContainer = css`
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${grey5};

  &:nth-child(even) {
    background-color: ${grey3};
  }

  &:last-of-type {
    border-bottom: none;
    border-radius: 0 0 ${borderRadius} ${borderRadius};
  }
`;

export const balanceTypeTitle = css`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;

  &::first-letter {
    text-transform: capitalize;
  }
`;

export const balanceTypeAmount = css`
  ${monospaceRegular}
  font-size: 14px;
  text-align: right;
  letter-spacing: -0.02em;
`;

export const balanceItemAmount = css`
  ${balanceTypeAmount}
  font-size: 12px;
`;

export const balanceType = css`
  color: ${grey30};
  font-size: 11px;
`;
