import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.button`
  ${container}
`;

export interface ButtonProps {
  label: ReactNode;
  onClick: (() => void) | undefined;
  disabled?: boolean;
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => (
  <Container onClick={!disabled && onClick ? () => onClick() : () => {}} disabled={disabled}>
    {label}
  </Container>
);

export default Button;
