import { css } from 'styled-components';

import { whitePlain, grey10, grey5 } from '@appConstants/colors';

export const container = css`
  background-color: ${whitePlain};
  border-bottom: 1px solid ${grey10};
  grid-area: title-bar;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 32px;
  justify-content: space-between;

  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

export const icon = css`
  align-self: center;
  border-left: 1px solid ${grey10};
  height: 16px;
  padding: 16px;
`;

export const windowControls = css`
  display: grid;
  grid-auto-flow: column;
`

const baseControl = css`
  border: none;
  padding-left: 40px;
  padding-right: 40px;
  height: 100%;
  background-color: ${whitePlain};

  &:hover {
    background-color: ${grey5};
  }
`

export const minimize = css`
  ${baseControl}
`

export const maximize = css<{maximized: boolean}>`
  ${baseControl}
`
  
export const close = css`
  ${baseControl}
`