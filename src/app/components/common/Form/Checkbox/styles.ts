import { css } from 'styled-components';
import { grey90 } from 'app/constants/colors';
import { inputShared, inlineInput, inputFocusColor } from 'app/constants/inputs';

export const inputContainer = css`
  ${inputShared};
  ${inlineInput};
  background-color: transparent;
`;

export const inputCheckbox = css`
  margin: 0;
  ${inputFocusColor};
`

export const valueLabel = css`
  font-size: 13px;
  color: ${grey90};
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`
