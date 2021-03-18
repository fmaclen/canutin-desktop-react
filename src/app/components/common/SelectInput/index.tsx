import React from 'react';
import styled from 'styled-components';

import { container, label, valuesContainer } from './styles';

const Container = styled.div`${container}`;
const Label = styled.label`${label}`;
const ValuesContainer = styled.div`${valuesContainer}`;

type RefReturn =
  | string
  | ((instance: HTMLSelectElement | null) => void)
  | React.RefObject<HTMLSelectElement>
  | null
  | undefined;

export type SelectInputValue = {
  name: string;
  label: string;
};

export interface SelectInputProps {
  label: string;
  name: string;
  values: SelectInputValue[];
  register: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
}

const SelectInput = ({ label, name, values, register, required = false }: SelectInputProps) => (
  <Container>
    <Label htmlFor={name}>{label}</Label>
    <ValuesContainer>
      <select name={name} ref={register({ required })} id={name}>
        {values.map(({ name, label }: SelectInputValue, index) => <option value={name} key={index}>{label}</option>)}
      </select>
    </ValuesContainer>
  </Container>
);

export default SelectInput;
