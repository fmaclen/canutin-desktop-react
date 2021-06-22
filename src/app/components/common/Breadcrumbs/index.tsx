import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { BreadcrumbData } from 'use-react-router-breadcrumbs';

import { ReactComponent as Chevron } from '@assets/icons/Chevron.svg';
import { container, text, breadcrumb } from './styles';

const Container = styled.div`
  ${container}
`;
const Breadcrumb = styled.div`
  ${breadcrumb}
`;
const Text = styled(NavLink)`
  ${text}
`;
export interface BreadcrumbsProps {
  items: BreadcrumbData[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <Container>
    {items.map(({ breadcrumb, match }, index) => (
      <Breadcrumb key={`${index}-${text}`}>
        <Text to={match.url}>{breadcrumb}</Text>
        {index !== items.length - 1 && <Chevron />}
      </Breadcrumb>
    ))}
  </Container>
);

export default Breadcrumbs;
