import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

import { container, icon, text } from './styles';

const Container = styled(Link)`
  ${container}
`;
const Icon = styled.div`
  ${icon}
`;
const Text = styled.p`
  ${text}
`;

export interface NavItemProps {
  icon: ReactNode;
  text: string;
  toggled: boolean;
  to: string;
  disabled?: boolean;
  primaryAction?: boolean;
}

const NavItem = ({
  icon,
  text,
  toggled,
  to,
  disabled = false,
  primaryAction = false,
}: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to ? 1 : 0;

  return (
    <Container
      active={isActive}
      toggled={toggled ? 1 : 0}
      to={to}
      disabled={disabled}
      primaryAction={primaryAction}
    >
      <Icon>{icon}</Icon>
      <Text toggled={toggled}>{text}</Text>
    </Container>
  );
};

export default NavItem;
