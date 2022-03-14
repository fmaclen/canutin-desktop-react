import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export const Container = styled.button`
  ${container}
`;

export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button',
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  disabled?: boolean;
  type?: ButtonType;
}

const Button = ({ children, onClick, type, disabled = false }: ButtonProps) => (
  <Container
    onClick={!disabled && onClick ? () => onClick() : () => {}}
    disabled={disabled}
    type={type || 'button'}
  >
    {children}
  </Container>
);

export default Button;
