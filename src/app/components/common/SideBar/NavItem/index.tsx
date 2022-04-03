import React, { ReactNode, useContext } from 'react';

import { AppContext } from '@app/context/appContext';
import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';

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
  const { linkAccount, setLinkAccount } = useContext(AppContext);
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Container
      active={+isActive}
      toggled={+toggled}
      to={to}
      disabled={disabled}
      data-testid={dataTestId}
      onClick={() =>
        to === '#sync' && linkAccount && setLinkAccount({ ...linkAccount, isSyncing: true })
      }
      replace
    >
      <Icon
        isSyncing={to === '#sync' && linkAccount ? linkAccount.isSyncing : false}
        data-testid={dataTestId}
      >
        {icon}
      </Icon>
      <Text toggled={toggled}>{text}</Text>
      {status && <Status>{status}</Status>}
    </Container>
  );
};

export default NavItem;
