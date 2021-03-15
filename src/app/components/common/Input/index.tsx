import React from 'react';
import styled from 'styled-components';

import { container, label } from './styles';

const Container = styled.div`${container}`;
const Label = styled.label`${label}`;

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface InputProps {
  label: string;
  name: string;
  type?: string;
  register: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
}

const Input = ({ label, name, register, type = 'text', required = false }: InputProps) => (
  <Container>
    <Label htmlFor={name}>{label}</Label>
    <input name={name} ref={register({ required })} type={type} id={name} />
  </Container>
);

export default Input;
