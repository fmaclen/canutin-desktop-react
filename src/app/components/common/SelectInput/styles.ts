import { css } from 'styled-components';
import { borderGrey, grey70, plainWhite } from 'app/constants/colors';
import { sansSerifBold } from 'app/constants/fonts';

export const container = css`
  align-items: center;
  display: flex;
  margin-top: 8px;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
`;

export const valuesContainer = css`
  background-color: ${plainWhite};
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
    width: 410px;

    &:focus {
      outline: none;
    }
  }
`;
