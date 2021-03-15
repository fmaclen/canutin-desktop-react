import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, body, title, subTitle } from './styles';

const Container = styled.div`${container}`;
const Header = styled.div`${header}`;
const Body = styled.div`${body}`;
const Title = styled.div`${title}`;
const SubTitle = styled.div`${subTitle}`;

export interface SetupOptionBoxProps {
  icon: ReactNode;
  title: string;
  subTitle: string;
  onClick: () => void;
  width?: number;
  disabled?: boolean;
}

const SetupOptionBox = ({ icon, title, subTitle, onClick, width = 510, disabled = false }: SetupOptionBoxProps) => (
  <Container onClick={!disabled ? () => onClick() : () => {}} width={width}>
    <Header disabled={disabled}>
      {icon}
    </Header>
    <Body>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </Body>
  </Container>
);

export default SetupOptionBox;
