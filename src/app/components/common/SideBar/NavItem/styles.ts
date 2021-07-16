import { css } from 'styled-components';
import { grey3, grey5, grey10, grey30, grey80, bluePlain } from '@appConstants/colors';

export interface NavItemProps {
  toggled: boolean | number;
  disabled?: boolean;
}

export const container = css<NavItemProps & { active: boolean | number; primaryAction: boolean }>`
  color: ${grey80};
  cursor: default;
  display: flex;
  font-size: 13px;
  grid-gap: 12px;
  grid-template-columns: max-content auto;
  padding: 8px 24px;
  box-sizing: border-box;
  height: 48px;
  align-items: center;
  text-decoration: none;
  stroke: ${grey30};
  outline: none;

  &:focus {
    background-color: ${grey3};
  }

  &:hover {
    background-color: ${grey5};
  }

  ${({ active }) =>
    active &&
    css`
      color: ${bluePlain};
      stroke: ${bluePlain};

      svg path {
        stroke: ${bluePlain};
      }
    `}

  ${({ toggled }) =>
    toggled &&
    css`
      grid-gap: none;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${grey10};
      pointer-events: none;
    `};

  ${({ primaryAction }) =>
    primaryAction &&
    css`
      border-top: 1px solid ${grey10};
    `};
`;

export const icon = css`
  display: flex;
  align-items: center;

  > svg {
    width: 16px;
    height: 16px;
  }
`;

export const text = css<NavItemProps>`
  display: ${({ toggled }) => (toggled ? 'block' : 'none')};
  font-size: 13px;
  font-weight: 600;

  -webkit-user-select: none;
`;
