import React from 'react';
import styled from 'styled-components';

import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';
import BalancesByTypeCard from '@components/BalanceSheet/BalanceByTypeCard';
import EmptyCard from '@components/common/EmptyCard';
import Card, { CardAppearanceEnum } from '@components/common/Card';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface BalanceGroupListProps {
  type: BalanceGroupEnum;
  balanceData?: {
    [nameOfBalance: string]: AccountAssetBalance[];
  };
}

const getTotal = (balance: AccountAssetBalance[]) =>
  balance.reduce((acc, currentBalance) => acc + currentBalance.amount, 0);

const sortBalanceDataByTotalAmount = (balanceData: { [x: string]: AccountAssetBalance[] }) =>
  Object.entries(balanceData).sort(
    (balanceB, balanceA) => getTotal(balanceA[1]) - getTotal(balanceB[1])
  );

// TODO: DRY the BalanceGroupEnum and CardApeparanceEnum
const cardPropsFromBalanceType = {
  [BalanceGroupEnum.CASH]: { label: 'Cash', appearance: CardAppearanceEnum.CASH },
  [BalanceGroupEnum.DEBT]: { label: 'Debt', appearance: CardAppearanceEnum.DEBT },
  [BalanceGroupEnum.INVESTMENT]: {
    label: 'Investment',
    appearance: CardAppearanceEnum.INVESTMENTS,
  },
  [BalanceGroupEnum.OTHER_ASSETS]: {
    label: 'Other assets',
    appearance: CardAppearanceEnum.OTHER_ASSETS,
  },
};

const BalanceGroupList = ({ type, balanceData }: BalanceGroupListProps) => {
  const totalAmount = balanceData
    ? Object.keys(balanceData).reduce((acc, assetTypeKey) => {
        const totalBalance = balanceData[assetTypeKey].reduce((acc, assetTypeBalance) => {
          return acc + assetTypeBalance.amount;
        }, 0);

        return acc + totalBalance;
      }, 0)
    : 0;

  return (
    <Container>
      <Card
        label={cardPropsFromBalanceType[type].label}
        appearance={cardPropsFromBalanceType[type].appearance}
        value={Math.round(totalAmount)}
        isCurrency={true}
      />
      {!balanceData ||
        (Object.keys(balanceData).length === 0 && (
          <EmptyCard message="No balances are available in this group." />
        ))}
      {balanceData &&
        sortBalanceDataByTotalAmount(balanceData).map(assetTypeName => (
          <BalancesByTypeCard
            key={assetTypeName[0]}
            assetTypeName={assetTypeName[0]}
            balanceData={assetTypeName[1]}
          />
        ))}
    </Container>
  );
};

export default BalanceGroupList;
