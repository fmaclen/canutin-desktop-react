import { css } from 'styled-components';
import {
  bluePlain,
  borderGrey,
  grey10,
  grey20,
  grey30,
  grey7,
  grey80,
  whitePlain,
} from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

export const container = css`
  border-top: 1px solid ${grey10};
  padding-top: 16px;
  display: grid;
  grid-row-gap: 8px;
`;


export const category = css`
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: 1fr 1fr;

  label {
    align-items: center;
    background-color: ${grey10};
    border: 2px solid ${borderGrey};
    border-radius: 4px;
    color: ${grey80};
    font-size: 13px;
    display: flex;
    padding-left: 12px;
  }
`;

export const categoryList = css`
  display: grid;
  grid-row-gap: 8px;
`;


export const toggableInputContainer = css`
  display: grid;
  grid-template-columns: minmax(96px, 1fr) 2fr;
  grid-gap: 8px;
`;
