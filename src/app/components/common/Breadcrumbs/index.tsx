import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Chevron } from '@assets/icons/Chevron.svg';
import { text, container } from './styles';

const Container = styled.div`
  ${container}
`;
const Text = styled.a`
  ${text}
`;

export type BreadcrumbType = {
  text: string;
  href: string;
};

export interface BreadcrumbsProps {
  items: BreadcrumbType[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <Container>
    {items.map(({ text, href }, index) => (
      <>
        <Text href={href}>{text}</Text>
        {index !== items.length - 1 && <Chevron />}
      </>
    ))}
  </Container>
);

export default Breadcrumbs;
