import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { StatusEnum } from '@appConstants/misc';

import { container } from './styles';

const Container = styled.button`
  ${container}
`;

export interface ButtonProps {
  children: ReactNode;
  onClick: (() => void) | undefined;
  disabled?: boolean;
  status?: StatusEnum;
}

const Button = ({ children, onClick, disabled = false, status }: ButtonProps) => (
  <Container
    onClick={!disabled && onClick ? () => onClick() : () => {}}
    disabled={disabled}
    status={status}
  >
    {children}
  </Container>
);

export default Button;
