import {
  eachWeekOfInterval,
  endOfWeek,
  getWeek,
} from 'date-fns';

import { Account, Asset, AssetBalanceStatement, BalanceStatement } from '@database/entities';

import {
  calculateBalanceDifference,
  ChartPeriodType,
  generatePlaceholdersChartPeriod,
  getSelectedBalanceStatementValue,
} from './balance.utils';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export const getNetWorthTrends = (
  accounts: Account[],
  assets: Asset[],
  dateFrom: Date,
  dateTo: Date,
  balanceGroupFilter: BalanceGroupEnum = BalanceGroupEnum.NET_WORTH
) => {
  const assetsNoSold = assets
    .filter(
      ({ balanceStatements }) =>
        balanceStatements && !balanceStatements?.[balanceStatements.length - 1].sold
    )
    .filter(
      ({ balanceGroup }) =>
        balanceGroupFilter === balanceGroup || balanceGroupFilter === BalanceGroupEnum.NET_WORTH
    );
  const accountsNoClosed = accounts
    .filter(({ closed }) => !closed)
    .filter(
      ({ balanceGroup }) =>
        balanceGroupFilter === balanceGroup || balanceGroupFilter === BalanceGroupEnum.NET_WORTH
    );
  const weeksDates = eachWeekOfInterval(
    {
      start: dateFrom,
      end: dateTo,
    },
    { weekStartsOn: 1 }
  );

  const netWorthBalances = weeksDates.reduce((acc: ChartPeriodType[], week, index) => {
    const accountBalanceWeek = accountsNoClosed.reduce((count, account) => {
      const balanceStatementValue = getSelectedBalanceStatementValue(
        account.balanceStatements as BalanceStatement[],
        week,
        endOfWeek(week, { weekStartsOn: 1 })
      );
      const balance = balanceStatementValue
        ? balanceStatementValue
        : acc[index - 1]?.balance
        ? acc[index - 1].balance
        : 0;

      return count + balance;
    }, 0);

    const assetBalanceWeek = assetsNoSold.reduce((count, asset) => {
      const balanceStatementValue = getSelectedBalanceStatementValue(
        asset.balanceStatements as AssetBalanceStatement[],
        week,
        endOfWeek(week, { weekStartsOn: 1 })
      );
      const balance = balanceStatementValue
        ? balanceStatementValue
        : acc[index - 1]?.balance
        ? acc[index - 1].balance
        : 0;

      return count + balance;
    }, 0);

    const balance = accountBalanceWeek + assetBalanceWeek;

    return [
      ...acc,
      {
        balance,
        week: getWeek(week),
        dateWeek: week,
        label: getWeek(week).toString(),
        difference: index === 0 ? 0 : calculateBalanceDifference(balance, acc[index - 1].balance),
        id: index,
      },
    ];
  }, []);

  return netWorthBalances;
};

export const generateTrendsChartData = (chartData: ChartPeriodType[], numberOfWeeks: number) => {
  return [
    ...generatePlaceholdersChartPeriod(
      chartData?.[0].dateWeek ? chartData?.[0].dateWeek : new Date(),
      numberOfWeeks,
      chartData.length > numberOfWeeks ? numberOfWeeks : chartData.length
    ),
    ...chartData,
  ];
};
