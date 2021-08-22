import React, { ReactNode, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

import { container, icon, text } from './styles';
import { AppContext } from '@app/context/appContext';

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
  margin-left: auto;
`;

export interface NavItemProps {
  icon: ReactNode;
  text: string;
  toggled: boolean;
  to: string;
  disabled?: boolean;
  primary?: boolean;
  status?: ReactNode;
}

const NavItem = ({
  icon,
  text,
  toggled,
  to,
  disabled = false,
  primary = false,
  status = false,
}: NavItemProps) => {
  const { pathname } = useLocation();
  const { linkAccount, setLinkAccount } = useContext(AppContext);
  const isActive = pathname === to ? 1 : 0;

  return (
    <Container
      active={isActive}
      toggled={toggled ? 1 : 0}
      to={to}
      disabled={disabled}
      primary={primary ? 1 : 0}
      onClick={() =>
        to === '#sync' && linkAccount && setLinkAccount({ ...linkAccount, isSyncing: true })
      }
    >
      <Icon isSyncing={to === '#sync' && linkAccount ? linkAccount.isSyncing : false}>{icon}</Icon>
      <Text toggled={toggled}>{text}</Text>
      {status && <Status>{status}</Status>}
    </Container>
  );
};

export default NavItem;
