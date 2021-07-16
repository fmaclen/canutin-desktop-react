import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';

import { ReactComponent as BurgerIcon } from '@assets/icons/Burger.svg';
import { ReactComponent as BigPicture } from '@assets/icons/BigPicture.svg';
import { ReactComponent as BalanceSheet } from '@assets/icons/BalanceSheet.svg';
import { ReactComponent as Settings } from '@assets/icons/Settings.svg';
import { ReactComponent as Budget } from '@assets/icons/Budget.svg';
import { ReactComponent as Transactions } from '@assets/icons/Transactions.svg';
import { ReactComponent as Trends } from '@assets/icons/Trends.svg';
import { ReactComponent as AddIcon } from '@assets/icons/Add.svg';
import { ReactComponent as Sync } from '@assets/icons/Sync.svg';

import NavItem from '@components/common/SideBar/NavItem';
import LinkSideBarIcon from '@components/CanutinLink/LinkSideBarIcon';
import { container, burgerButton, topNav, bottomNav, navItems } from './styles';

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

const SideBar = () => {
  const [toggled, setToggled] = useState(true);
  const { isDbEmpty, isUserLoggedIn } = useContext(AppContext);

  return (
    <Container>
      <TopNav>
        <BurgerButton onClick={() => setToggled(!toggled)}>
          <BurgerIcon />
        </BurgerButton>

        <NavItems>
          <NavItem
            icon={<BigPicture />}
            text="The big picture"
            toggled={toggled}
            to={routesPaths.bigpicture}
            disabled={isDbEmpty}
          />

          <NavItem
            icon={<BalanceSheet />}
            text="Balance sheet"
            toggled={toggled}
            to={routesPaths.balance}
            disabled={isDbEmpty}
          />

          <NavItem
            icon={<Budget />}
            text="Budget"
            toggled={toggled}
            to={routesPaths.budget}
            disabled={isDbEmpty}
          />

          <NavItem
            icon={<Transactions />}
            text="Transactions"
            toggled={toggled}
            to={routesPaths.transactions}
            disabled={isDbEmpty}
          />

          <NavItem
            icon={<Trends />}
            text="Trends"
            toggled={toggled}
            to={routesPaths.trends}
            disabled={isDbEmpty}
          />
        </NavItems>
      </TopNav>

      <BottomNav>
        <NavItems>
          <NavItem
            icon={<LinkSideBarIcon />}
            text="Link"
            toggled={toggled}
            to={routesPaths.link}
            disabled={isDbEmpty}
          />

          <NavItem
            icon={<Settings />}
            text="Settings"
            toggled={toggled}
            to={routesPaths.settings}
          />

          <NavItem
            icon={<AddIcon />}
            text="Add accounts or assets"
            toggled={toggled}
            to={routesPaths.addAccountOrAsset}
            isPrimary={!isUserLoggedIn}
          />

          {isUserLoggedIn && (
            <NavItem
              icon={<Sync />}
              text="Sync"
              toggled={toggled}
              to={'/'}
              isPrimary={isUserLoggedIn}
            />
          )}
        </NavItems>
      </BottomNav>
    </Container>
  );
};

export default SideBar;
