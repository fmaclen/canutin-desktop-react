import { css } from 'styled-components';
import { bluePlain, borderGrey, grey20, grey30, grey7, grey90, whitePlain } from 'app/constants/colors';
import { sansSerifBold, sansSerifRegular } from '../../../constants/fonts';
import { inputFocusColor } from '../../../constants/inputs';

export const formContainer = css`
  border: 1px solid ${borderGrey};
  border-radius: 4px;
  display: grid;
  grid-row-gap: 8px;
  padding-top: 12px;
`;

export const form = css`
  align-items: center;
  display: grid;
  grid-row-gap: 8px;
`;

export const formFooter = css`
  align-items: center;
  background-color: ${grey7};
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  padding: 12px;
`;

export const formSubmitButton = css<{ disabled: boolean }>`
  ${sansSerifBold};
  background-color: ${({ disabled }) => disabled ? grey20 : bluePlain};
  color: ${({ disabled }) => disabled ? grey30 : whitePlain};
  cursor: ${({ disabled }) => disabled ? null : 'pointer'};
  border: none;
  border-radius: 4px;
  padding: 12px 32px;

  &:focus {
    outline: none;
  }
`;

export const toggableInputContainer = css`
  display: grid;
  grid-template-columns: minmax(96px, 1fr) 2fr;
  grid-gap: 8px;
`

export const checkboxContainerLabel = css`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: max-content auto;
  align-items: center;
  border: 2px solid ${borderGrey};
  border-radius: 4px;
  padding: 12px 8px;
`;

export const checkbox = css`
  background-color: ${whitePlain};
  margin: 0;
  ${inputFocusColor};
`;

export const checkboxLabel = css`
  ${sansSerifRegular};
  font-size: 13px;
  color: ${grey90};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
