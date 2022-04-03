import React from 'react';
import styled from 'styled-components';

import Field from '@components/common/Form/Field';

import { container, title, description } from './styles';

const Container = styled.div`
  ${container}
`;
const Title = styled.div`
  ${title}
`;
const Description = styled.div`
  ${description}
`;

interface FieldNoticeProps {
  title: string;
  description: JSX.Element;
  label?: string;
  error?: boolean;
}

const FieldNotice = ({ title, description, label, error = false }: FieldNoticeProps) => {
  return (
    <Field name={title} label={label}>
      <Container error={error}>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Container>
    </Field>
  );
};

export default FieldNotice;
