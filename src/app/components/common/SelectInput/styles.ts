import { css } from 'styled-components';
import { borderGrey, grey70, whitePlain } from 'app/constants/colors';
import { sansSerifBold } from 'app/constants/fonts';

export const container = css`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
  text-align: end;
`;

export const valuesContainer = css`
  background-color: ${whitePlain};
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  
  select {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;

    &:focus {
      outline: none;
    }
  }
`;
