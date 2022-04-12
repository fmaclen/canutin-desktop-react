import React, { ReactNode, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

import { LinkContext } from '@app/context/linkContext';

import { container, text, icon, status } from './styles';

const Container = styled(Link)`
  ${container}
`;
const Icon = styled.div`
  ${icon}
`;
const Text = styled.p`
  ${text}
`;
const Status = styled.div`
  ${status}
`;

interface NavItemProps {
  icon: ReactNode;
  text: string;
  toggled: boolean;
  to: string;
  disabled?: boolean;
  dataTestId?: string;
  status?: ReactNode;
}

const NavItem = ({
  icon,
  text,
  toggled,
  to,
  dataTestId,
  disabled = false,
  status = false,
}: NavItemProps) => {
  const { isSyncing, setIsSyncing } = useContext(LinkContext);
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Container
      active={+isActive}
      toggled={+toggled}
      to={to}
      disabled={disabled}
      data-testid={dataTestId}
      onClick={() => to === '#sync' && setIsSyncing(true)}
      replace
    >
      <Icon isSyncing={to === '#sync' && isSyncing}>{icon}</Icon>
      <Text toggled={toggled}>{text}</Text>
      {status && <Status>{status}</Status>}
    </Container>
  );
};

export default NavItem;
