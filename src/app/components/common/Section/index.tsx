import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, title, subTitle, body } from './styles';

export const Container = styled.div`${container}`;
export const Header = styled.div`${header}`;
export const Title = styled.div`${title}`;
export const SubTitle = styled.div`${subTitle}`;
export const Body = styled.div`${body}`;

export interface SectionProps {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

const Section = ({ title, subTitle, children }: SectionProps) => (
  <Container>
    <Header>
      <Title subTitle={!!subTitle}>{title}</Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </Header>
    <Body>
      {children}
    </Body>
  </Container>
);

export default Section;
