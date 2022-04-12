import { css } from 'styled-components';
import { grey3, grey5, grey10, grey30, grey80, bluePlain } from '@appConstants/colors';

export const container = css<{
  disabled?: boolean;
  // Because this is a styled `Link` the props are passed as string attributes
  // so instead we expect a `1` or `0` as a booleans.
  // REF: https://github.com/styled-components/styled-components/issues/1198#issuecomment-336628848
  toggled: boolean | number;
  active?: boolean | number;
}>`
  color: ${grey80};
  cursor: default;
  display: flex;
  font-size: 13px;
  grid-gap: 16px;
  grid-template-columns: max-content auto;
  align-items: center;
  padding: 16px 24px;
  box-sizing: border-box;
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
    `}
`;

export const icon = css<{ isSyncing: boolean }>`
  display: flex;
  align-items: center;

  > svg {
    width: 16px;
    height: 16px;
  }

  ${({ isSyncing }) =>
    isSyncing &&
    css`
      animation: spin-animation 1.5s infinite;

      @keyframes spin-animation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(359deg);
        }
      }
    `};
`;

export const text = css<{ toggled: boolean }>`
  display: ${({ toggled }) => (toggled ? 'block' : 'none')};
  font-size: 13px;
  font-weight: 600;

  -webkit-user-select: none;
`;

export const status = css`
  margin-left: auto;
`;
