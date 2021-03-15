import { css } from 'styled-components';
import { borderGrey, grey80, grey70 } from 'app/constants/colors';
import { sansSerifBold } from 'app/constants/fonts';

export const container = css`
  display: flex;
`;

export const label = css`
  ${sansSerifBold};
  font-size: 12px;
  color: ${grey70};
  padding-right: 20px;
  padding-top: 20px;
`;

export const valuesContainer = css`
  border: 2px solid ${borderGrey};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  min-width: 410px;
  padding: 10px;
`;

export const inputGroup = css`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
  height: 20px;
  
  input {
    cursor: pointer;
    margin: 0 8px 0 0;
  }
`;

export const valueLabel = css`
  color: ${grey80};
  font-size: 13px;
`;