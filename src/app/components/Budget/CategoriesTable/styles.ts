import { css } from 'styled-components';

import { grey3, grey50, grey80, borderGrey, whitePlain } from '@app/constants/colors';

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

  ${({ isSorted }) =>
    isSorted &&
    css`
      color: ${grey80};
    `}
`;

export const tableContainer = css`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
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

    &:last-child {
      > td:first-child {
        border-bottom-left-radius: 4px;
      }

      > td:last-child {
        border-bottom-right-radius: 4px;
      }
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
`;
