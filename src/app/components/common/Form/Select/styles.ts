import { css } from 'styled-components';

import { inputShared } from '@appConstants/inputs';
import { bluePlain, blueLight, redPlain, borderGrey } from '@appConstants/colors';

const innerSpacing = '6px';

export const selectInput = css<{ error: string | undefined; isClearable: boolean }>`
  .select {
    &__control {
      ${inputShared}

      ${({ error }) =>
        error &&
        css`
          border: 2px solid ${redPlain};
        `}
      padding: 0;
      box-shadow: none;

      &:focus {
        outline-color: none;
      }

      &:hover {
        border-color: ${borderGrey};
      }

      &--is-focused,
      &--is-focused:hover {
        border-color: ${bluePlain};
      }
    }

    ${({ isClearable }) =>
      !isClearable &&
      css`
        &__indicator-separator {
          display: none;
        }
      `}

    &__dropdown-indicator {
      padding-left: ${innerSpacing};
      padding-right: ${innerSpacing};
    }

    &__value-container {
      padding-left: ${innerSpacing};
      padding-right: ${innerSpacing};
    }

    &__menu-list {
      ${inputShared}
      border: none;
      padding: 0;
    }

    &__option {
      &:hover {
        background-color: ${blueLight};
      }

      &--is-selected:hover,
      &--is-selected {
        background-color: ${bluePlain};
      }
    }
  }
`;
