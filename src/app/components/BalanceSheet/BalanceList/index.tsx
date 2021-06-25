import React from 'react';
import styled from 'styled-components';

import BalanceItem from '@components/BalanceSheet/BalanceItem';
import { BalanceGroupCardTypeEnum } from '@app/components/common/BalanceGroupCard/constants';

import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export type AccountAssetBalance = {
  name: string;
  type: string;
  amount: number;
};

export type BalanceData = {
  [value in BalanceGroupEnum]?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
};

export interface BalanceListProps {
  balanceListData: BalanceData;
}

const BalanceList = ({ balanceListData }: BalanceListProps) => (
  <Container>
    <BalanceItem
      type={BalanceGroupCardTypeEnum.CASH}
      balanceData={balanceListData[BalanceGroupEnum.CASH]}
    />
    <BalanceItem
      type={BalanceGroupCardTypeEnum.DEBT}
      balanceData={balanceListData[BalanceGroupEnum.DEBT]}
    />
    <BalanceItem
      type={BalanceGroupCardTypeEnum.INVESTMENTS}
      balanceData={balanceListData[BalanceGroupEnum.INVESTMENT]}
    />
    <BalanceItem
      type={BalanceGroupCardTypeEnum.OTHER_ASSETS}
      balanceData={balanceListData[BalanceGroupEnum.OTHER_ASSETS]}
    />
  </Container>
);

export default BalanceList;
