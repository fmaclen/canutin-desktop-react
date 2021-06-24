import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export enum SubmitButtonOptions {
  DEFAULT = 'default',
  SECONDARY = 'secondary',
}

export interface SubmitButtonProp {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  buttonType?: SubmitButtonOptions;
}

const Container = styled.button`
  ${container}
`;

const SubmitButton = ({ children, onClick, disabled = false }: SubmitButtonProp) => {
  return (
    <Container
      type="submit"
      onClick={!disabled && onClick ? () => onClick() : () => {}}
      disabled={disabled}
    >
      {children}
    </Container>
  );
};

export default SubmitButton;
