import {
  eachWeekOfInterval,
  endOfWeek,
  getWeek,
  isAfter,
  isBefore,
  isEqual,
  startOfWeek,
} from 'date-fns';

import { Account, Asset } from '@database/entities';

import {
  calculateBalanceDifference,
  ChartPeriodType,
  generateAccountBalanceInfo,
  generateAssetBalanceInfo,
  generatePlaceholdersChartPeriod,
  getTotalBalanceByGroup,
} from './balance.utils';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export const isBetweenWeek = (week: Date, dateCompare: Date | undefined) => {
  return dateCompare
    ? (isBefore(week, dateCompare) || isEqual(week, dateCompare)) &&
        isAfter(endOfWeek(week, { weekStartsOn: 1 }), dateCompare)
    : false;
};

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
    .filter(({ closed, balanceGroup }) => !closed)
    .filter(
      ({ balanceGroup }) =>
        balanceGroupFilter === balanceGroup || balanceGroupFilter === BalanceGroupEnum.NET_WORTH
    );
  const weeksDates = eachWeekOfInterval({
    start: dateFrom,
    end: dateTo,
  });

  const netWorthBalances = weeksDates.reduce((acc: ChartPeriodType[], week, index) => {
    const accountBalanceWeek = accountsNoClosed.reduce((count, account) => {
      if (account.balanceStatements?.[account.balanceStatements.length - 1].autoCalculate) {
        const accountTotalBalanceForWeekInterval = account?.transactions
          ? account?.transactions?.reduce((total, transaction) => {
              if (isBetweenWeek(week, transaction.date)) {
                return total + transaction.amount;
              }

              return total;
            }, 0)
          : 0;

        return count + accountTotalBalanceForWeekInterval;
      }

      if (account.balanceStatements?.[account.balanceStatements.length - 1]?.value) {
        return (
          count +
          (account.balanceStatements?.[account.balanceStatements.length - 1]?.value as number)
        );
      }

      return count;
    }, 0);

    const assetBalanceWeek = assetsNoSold.reduce((count, asset) => {
      if (
        isBetweenWeek(week, asset.balanceStatements?.[asset.balanceStatements.length - 1].updatedAt)
      ) {
        return (
          count + (asset.balanceStatements?.[asset.balanceStatements.length - 1].value as number)
        );
      }

      return count;
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
}