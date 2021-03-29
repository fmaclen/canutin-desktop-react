import React, { ReactNode }  from 'react';
import styled from 'styled-components';

import { container, label, optionalTag } from './styles';

const Container = styled.div`${container}`;
const Label = styled.label`${label}`;
const OptionalTag = styled.span`${optionalTag}`;

export interface FieldProps {
  label?: string;
  name: string;
  optional?: boolean;
  children?: ReactNode;
}

const Field = ({
  label,
  name,
  optional = false,
  children,
}: FieldProps) => (
  <Container>
    {label && <Label htmlFor={name}>
      {label}
      {optional && <OptionalTag> / Optional</OptionalTag>}
    </Label>}
    {children}
  </Container>
);

export default Field;
