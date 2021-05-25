import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.form`
  ${container}
`;

export interface FormProps {
  children: ReactNode;
  role?: string;
}

const Form = ({ children }: FormProps) => <Container>{children}</Container>;

export default Form;
