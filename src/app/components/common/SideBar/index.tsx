import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import * as timeago from 'timeago.js';

import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { VaultStatusEnum } from '@enums/vault.enum';
import { capitalize } from '@app/utils/strings.utils';

import { ReactComponent as Burger } from '@assets/icons/Burger.svg';
import { ReactComponent as BigPicture } from '@assets/icons/BigPicture.svg';
import { ReactComponent as BalanceSheet } from '@assets/icons/BalanceSheet.svg';
import { ReactComponent as Settings } from '@assets/icons/Settings.svg';
import { ReactComponent as Budget } from '@assets/icons/Budget.svg';
import { ReactComponent as Transactions } from '@assets/icons/Transactions.svg';
import { ReactComponent as Trends } from '@assets/icons/Trends.svg';
import { ReactComponent as Add } from '@assets/icons/Add.svg';
import { ReactComponent as Sync } from '@assets/icons/Sync.svg';

import NavItem from './NavItem';
import LinkSideBarIcon from '@app/components/CanutinLink/LinkSideBarIcon';

import { container, burgerButton, topNav, bottomNav, navItems, lastSync } from './styles';

const Container = styled.nav`
  ${container}
`;
const BurgerButton = styled.button`
  ${burgerButton}
`;
const NavItems = styled.div`
  ${navItems}
`;
const TopNav = styled.nav`
  ${topNav}
`;
const BottomNav = styled.nav`
  ${bottomNav}
`;
const LastSync = styled.p`
  ${lastSync};
`;

const SideBar = () => {
  const [toggled, setToggled] = useState(true);
  const { vaultStatus, linkAccount } = useContext(AppContext);
  const isNavDisabled = vaultStatus !== VaultStatusEnum.INDEXED_WITH_DATA;

  return (
    <Container>
      <TopNav>
        <BurgerButton onClick={() => setToggled(!toggled)}>
          <Burger />
        </BurgerButton>

        <NavItems>
          <NavItem
            icon={<BigPicture />}
            text="The big picture"
            toggled={toggled}
            to={routesPaths.bigpicture}
            disabled={isNavDisabled}
            dataTestId="sidebar-big-picture"
          />

          <NavItem
            icon={<BalanceSheet />}
            text="Balance sheet"
            toggled={toggled}
            to={routesPaths.balance}
            disabled={isNavDisabled}
            dataTestId="sidebar-balance-sheet"
          />

          <NavItem
            icon={<Budget />}
            text="Budget"
            toggled={toggled}
            to={routesPaths.budget}
            disabled={isNavDisabled}
            dataTestId="sidebar-budget"
          />

          <NavItem
            icon={<Transactions />}
            text="Transactions"
            toggled={toggled}
            to={routesPaths.transactions}
            disabled={isNavDisabled}
            dataTestId="sidebar-transactions"
          />

          <NavItem
            icon={<Trends />}
            text="Trends"
            toggled={toggled}
            to={routesPaths.trends}
            disabled={isNavDisabled}
          />
        </NavItems>
      </TopNav>

      <BottomNav>
        {/* FIXME: Icon for link is wrong color and size for sidebar */}
        <NavItem icon={<LinkSideBarIcon />} text="Link" toggled={toggled} to={routesPaths.link} />

        <NavItem icon={<Settings />} text="Settings" toggled={toggled} to={routesPaths.settings} />

        <NavItem
          icon={<Add />}
          text="Add or update data"
          toggled={toggled}
          to={routesPaths.addOrUpdateData}
          dataTestId="sidebar-add-or-update-data"
        />
        {linkAccount && (
          <NavItem
            icon={<Sync />}
            text={linkAccount.isSyncing ? 'Syncing' : 'Sync'}
            toggled={toggled}
            to={'#sync'}
            status={
              toggled && <LastSync>{capitalize(timeago.format(linkAccount.lastSync))}</LastSync>
            }
          />
        )}
      </BottomNav>
    </Container>
  );
};

export default SideBar;
