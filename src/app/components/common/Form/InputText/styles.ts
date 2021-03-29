import { css } from 'styled-components';
import { grey10, whitePlain } from 'app/constants/colors';
import { inputShared } from 'app/constants/inputs';

export const inputElement = css<{ disabled: boolean }>`
  ${inputShared};
  background-color: ${({ disabled }) => disabled ? grey10 : whitePlain};
`;
