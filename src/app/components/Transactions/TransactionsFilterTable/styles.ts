import { css } from 'styled-components';

import { monospaceRegular } from '@app/constants/fonts';
import {
  greenPlain,
  grey10,
  grey30,
  grey80,
  grey90,
  underline,
  underlineHover,
  blackPlain,
  bluePlain,
  blackOpacity15,
  grey3,
  shadowPlate,
  borderGrey,
  grey50,
  whitePlain,
} from '@app/constants/colors';

export const container = css`
  background-color: ${grey3};
  border-radius: 8px;
  box-shadow: ${shadowPlate};
  display: flex;
  flex-direction: column;
`;

export const filterContainer = css`
  display: grid;
  grid-gap: 8px;
  padding: 16px;
`;

export const amountCell = css<{ value: number; excludeFromTotals: boolean }>`
  ${monospaceRegular}

  color: ${grey90};
  font-size: 11px;
  letter-spacing: 0.05em;

  ${({ value }) =>
    value > 0 &&
    css`
      color: ${greenPlain};
    `}

  ${({ excludeFromTotals }) =>
    excludeFromTotals &&
    css`
      color: ${grey30};
      border-bottom: 1px dashed ${grey10};
      cursor: help;
    `}
`;

export const dateCell = css`
  ${monospaceRegular};
  color: ${grey80};
  font-size: 11px;
  text-transform: uppercase;
`;

export const descriptionCell = css`
  ${underline};
  color: ${grey80};
  font-size: 12px;
  text-decoration: none;

  &:hover {
    ${underlineHover}
    color: ${blackPlain};
    cursor: pointer;
  }
`;

export const linkCell = css`
  color: ${grey80};
  font-size: 12px;
`;

export const tableHeaderRow = css`
  background-color: ${whitePlain};
`;

export const tableHeaderItem = css<{ isSorted: boolean }>`
  color: ${grey50};
  background-color: ${whitePlain};
  font-size: 12px;
  text-align: left;
  font-weight: 400;
  position: sticky;
  top: 0;
  padding: 12px;
  box-shadow: 0 2px 0 ${borderGrey}, 0 -1px 0 ${borderGrey};

  > div {
    align-items: center;
    display: flex;
  }

  &:hover {
    color: ${grey80};
  }

  &:first-of-type {
    padding-left: 12px;
  }

  &:last-of-type {
    > div {
      justify-content: flex-end;
    }
    padding-right: 12px;
  }

  ${({ isSorted }) =>
    isSorted &&
    css`
      color: ${grey80};
    `}
`;

export const tableContainer = css`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-collapse: collapse;
  background-color: ${whitePlain};
`;

export const tableSortIcon = css`
  color: ${grey80};
  font-size: 8px;
  padding-left: 4px;
`;

export const row = css`
  &:nth-child(odd) {
    > td {
      background-color: ${grey3};
    }
  }
`;

export const rowItem = css`
  align-items: center;
  justify-content: center;
  padding: 12px;

  &:first-of-type {
    padding-left: 12px;
  }

  &:last-of-type {
    text-align: right;
    padding-right: 12px;
  }
`;
