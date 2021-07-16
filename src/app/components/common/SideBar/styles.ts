import { css } from 'styled-components';
import { grey3, grey5, grey10, whitePlain, grey80 } from '@appConstants/colors';

export const container = css`
  grid-area: side-bar;
  display: grid;
  grid-gap: 24px;
  justify-content: space-between;
  background-color: ${whitePlain};
  border-right: 1px solid ${grey10};
  height: 100%;
`;

export const burgerButton = css`
  padding: 24px;
  text-align: left;
  border: none;
  color: ${grey80};
  background-color: transparent;
  outline: none;

  &:focus {
    background-color: ${grey3};
  }

  &:hover {
    background-color: ${grey5};
  }
`;

export const topNav = css`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-gap: 24px;
`;

export const bottomNav = css`
  margin-top: auto;
`;

export const navItems = css`
  display: grid;
  grid-auto-flow: row;
`;

export const primaryNavItem = css`
  border-top: 1px solid ${grey10};
`;
