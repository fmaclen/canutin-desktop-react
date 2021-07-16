import { css } from 'styled-components';

import { StatusEnum } from '@appConstants/misc';

import { sansSerifBold } from '@appConstants/fonts';
import { grey20, grey40, grey70, getStatusColor } from '@appConstants/colors';

export const container = css<{ status?: StatusEnum }>`
  ${sansSerifBold};
  cursor: pointer;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 3px;
  color: ${grey70};
  background-color: transparent;
  line-height: 1em;
  transition: transform 100ms;
  outline: none;
  border: 1px solid ${grey20};
  border-color: ${({ status }) => status && getStatusColor(status)};
  color: ${({ status }) => status && getStatusColor(status)};

  &:active,
  &:focus,
  &:hover {
    border-color: ${grey40};
    border-color: ${({ status }) => status && getStatusColor(status)};
  }

  &:active {
    transform: scale(0.98);
  }
`;
