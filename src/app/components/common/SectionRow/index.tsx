import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface SectionRowProps {
  children: ReactNode;
  className?: string;
}

const SectionRow = ({ className, children }: SectionRowProps) => (
  <Container className={className}>{children}</Container>
);

export default SectionRow;
