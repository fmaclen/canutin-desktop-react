import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { StatusEnum } from '@app/constants/misc';

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
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonType;
  className?: string;
  status?: StatusEnum;
}

const Button = ({ children, onClick, type, className, disabled = false, status }: ButtonProps) => (
  <Container
    onClick={!disabled && onClick ? () => onClick() : () => {}}
    disabled={disabled}
    type={type || 'button'}
    className={className}
    status={status}
  >
    {children}
  </Container>
);

export default Button;
