import React, { useState } from 'react';
import styled from 'styled-components';

import BalanceSheetTab from '@components/BalanceSheet/BalanceSheetTab';

import {
  container,
  header,
  balanceSheetTitle,
  balanceSheetTabs,
  balanceSheetViewer,
} from './styles';

const Container = styled.div`
  ${container}
`;

const Header = styled.div`
  ${header}
`;

const BalanceSheetTitle = styled.div`
  ${balanceSheetTitle}
`;

const BalanceSheetTabs = styled.div`
  ${balanceSheetTabs}
`;

const BalanceSheetViewer = styled.div`
  ${balanceSheetViewer}
`;

export enum BalanceSheetTabsEnum {
  ALL = 'ALL',
  ACCOUNTS = 'ACCOUNTS',
  ASSETS = 'ASSETS',
}

const BalanceSheetTabViewer = () => {
  const [selectedTab, setSelectedTab] = useState(BalanceSheetTabsEnum.ALL);

  // Tab count
  const countAccounts = 10;
  const countAssets = 9;
  const countList = {
    ALL: '',
    ACCOUNTS: countAccounts,
    ASSETS: countAssets,
  };

  const allBalanceSheet = <div>All</div>;
  const accountsBalanceSheet = <div>Accounts</div>;
  const assetsBalanceSheet = <div>Assets</div>;

  return (
    <Container>
      <Header>
        <BalanceSheetTitle>Balances</BalanceSheetTitle>
        <BalanceSheetTabs>
          {Object.values(BalanceSheetTabsEnum).map((balanceSheetTabTitle, key) => (
            <BalanceSheetTab
              onClick={() => setSelectedTab(balanceSheetTabTitle)}
              isActive={balanceSheetTabTitle === selectedTab}
              key={key}
            >{`${balanceSheetTabTitle} ${countList[balanceSheetTabTitle]}`}</BalanceSheetTab>
          ))}
        </BalanceSheetTabs>
      </Header>
      <BalanceSheetViewer>
        {selectedTab === BalanceSheetTabsEnum.ALL && allBalanceSheet}
        {selectedTab === BalanceSheetTabsEnum.ACCOUNTS && accountsBalanceSheet}
        {selectedTab === BalanceSheetTabsEnum.ASSETS && assetsBalanceSheet}
      </BalanceSheetViewer>
    </Container>
  );
};

export default BalanceSheetTabViewer;
