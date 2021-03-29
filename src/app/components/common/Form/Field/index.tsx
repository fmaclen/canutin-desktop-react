import React, { ReactNode }  from 'react';
import styled from 'styled-components';

import { container, label, optionalTag } from './styles';

const Container = styled.div`${container}`;
const Label = styled.label`${label}`;
const OptionalTag = styled.span`${optionalTag}`;

export interface FieldProps {
  label?: string;
  name: string;
  disabled?: boolean;
  optional?: boolean;
  children?: ReactNode;
}

const Field = ({
  label,
  name,
  disabled = false,
  optional = false,
  children,
}: FieldProps) => (
  <Container disabled={disabled}>
    {label && <Label htmlFor={name}>
      {label}
      {optional && <OptionalTag> / Optional</OptionalTag>}
    </Label>}
    {children}
  </Container>
);

export default Field;
