import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export interface SubmitButtonProp {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  appearance?: string;
}

const Container = styled.button`
  ${container}
`;

const SubmitButton = ({ children, onClick, appearance, disabled = false }: SubmitButtonProp) => {
  return (
    <Container
      type={appearance === 'secondary' ? 'button' : 'submit'}
      onClick={!disabled && onClick ? () => onClick() : () => {}}
      disabled={disabled}
      appearance={appearance}
    >
      {children}
    </Container>
  );
};

export default SubmitButton;
