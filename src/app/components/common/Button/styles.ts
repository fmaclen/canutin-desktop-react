import { css } from 'styled-components';

import { StatusEnum } from '@appConstants/misc';

import { sansSerifBold } from '@appConstants/fonts';
import {
  grey20,
  grey30,
  grey40,
  grey70,
  redLight,
  blueLight,
  getStatusColor,
  greenPlain,
} from '@appConstants/colors';

export const container = css<{ disabled?: boolean; status?: StatusEnum }>`
  ${sansSerifBold};
  padding: 10px 16px;
  font-size: 12px;
  border-radius: 3px;
  color: ${grey70};
  border: 1px solid ${grey20};
  background-color: transparent;
  line-height: 1em;
  transition: transform 100ms;
  outline: none;
  border-color: ${({ status }) => status && getStatusColor(status)};
  color: ${({ status }) => status && getStatusColor(status)};

  &:active,
  &:focus,
  &:hover {
    border-color: ${grey40};
    border-color: ${({ status }) => status && getStatusColor(status)};
  }

  &:hover {
    background-color: ${({ status }) =>
      status === StatusEnum.NEGATIVE ? redLight : status === StatusEnum.NEUTRAL ? blueLight : null};
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      border: none;
      background-color: ${grey20};
      color: ${grey30};
      cursor: default;
    `}
`;
