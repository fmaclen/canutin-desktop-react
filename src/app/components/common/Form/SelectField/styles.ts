import { css } from 'styled-components';
import { inputShared } from '@appConstants/inputs';

export const selectInput = css`
  .select {
    &__control {
      ${inputShared}
      padding: 0;
    }

    &__indicator-separator {
      display: none;
    }

    &__menu-list {
      ${inputShared}
      border: none;
      padding: 0;
    }
  }
`;
