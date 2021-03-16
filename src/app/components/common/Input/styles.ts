import { css } from 'styled-components';
import { borderGrey, grey70, whitePlain } from 'app/constants/colors';
import { sansSerifBold } from 'app/constants/fonts';

export const container = css`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  margin-top: 8px;

  input {
    background-color: ${whitePlain};
    border: 2px solid ${borderGrey};
    border-radius: 5px;
    padding: 10px;
    width: 410px;

    &:focus {
      outline: none;
    }
  }
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
`;
