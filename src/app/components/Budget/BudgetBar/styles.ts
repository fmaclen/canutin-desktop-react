import { css } from 'styled-components';

import { StatusEnum } from '@app/constants/misc';

import {
  whitePlain,
  shadowPlate,
  grey10,
  grey3,
  greenPlain,
  yellowLight,
  blueLight,
  bluePlain,
  yellowPlain,
  greenLight,
  redPlain,
  redLight,
} from '@app/constants/colors';
import { monospaceRegular, sansSerifBold } from '@app/constants/fonts';

export const container = css`
  background-color: ${whitePlain};
  border-radius: 5px;
  box-shadow: ${shadowPlate};
  display: grid;
  grid-template-columns: repeat(10, 1fr);
`;

export const header = css`
  align-items: center;
  display: flex;
  grid-column-end: span 2;
  padding-right: 70px;
  box-sizing: border-box;

  h2 {
    ${sansSerifBold}
    font-size: 13px;
    padding-left: 16px;
  }
`;

export const progressContainer = css`
  grid-column-end: span 6;
  border-left: 1px solid ${grey10};
  border-right: 1px solid ${grey10};
  background-color: ${grey3};
  height: 100%;
  align-items: center;
  display: flex;
`;

export const progress = css<{ status: StatusEnum; percentage: number }>`
  width: ${({ percentage }) => `${percentage}%`};

  position: relative;
  display: flex;
  align-items: center;
  font-size: 11px;
  padding: 16px 0;
  height: 100%;
  box-sizing: border-box;
  background-color: ${blueLight};
  justify-content: flex-end;

  ::after {
    content: '';
    position: absolute;
    display: block;
    height: 100%;
    width: 3px;
    background-color: ${bluePlain};
    z-index: 2;

    ${({ status }) => {
      if (status === StatusEnum.POSITIVE) {
        return `
          background-color: ${greenPlain}
        `;
      }

      if (status === StatusEnum.WARNING) {
        return `
          background-color: ${yellowPlain}
        `;
      }

      if (status === StatusEnum.NEGATIVE) {
        return `
          background-color: ${redPlain}
        `;
      }

      if (status === StatusEnum.NEUTRAL) {
        return `
          background-color: ${bluePlain}
        `;
      }
    }}
  }

  div {
    ${monospaceRegular}
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    z-index: 3;
    border-radius: 3px;
    padding: 2px;
    white-space: nowrap;

    ${({ status }) => {
      if (status === StatusEnum.POSITIVE) {
        return `
          color: ${greenPlain}
        `;
      }

      if (status === StatusEnum.WARNING) {
        return `
          color: ${yellowPlain}
        `;
      }

      if (status === StatusEnum.NEGATIVE) {
        return `
          color: ${redPlain}
        `;
      }

      if (status === StatusEnum.NEUTRAL) {
        return `
          color: ${bluePlain}
        `;
      }
    }}
  }

  ${({ status }) => {
    if (status === StatusEnum.POSITIVE) {
      return `
        background-color: ${greenLight}
      `;
    }

    if (status === StatusEnum.NEGATIVE) {
      return `
        background-color: ${redLight}
      `;
    }

    if (status === StatusEnum.WARNING) {
      return `
        background-color: ${yellowLight}
      `;
    }

    if (status === StatusEnum.NEUTRAL) {
      return `
        background-color: ${blueLight}
      `;
    }
  }}
`;

export const balanceContainer = css`
  grid-column-end: span 2;
  text-align: right;
  font-size: 14px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px;

  span {
    ${monospaceRegular}
  }
`;
