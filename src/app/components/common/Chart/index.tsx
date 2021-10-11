import React, { useState } from 'react';
import { getWeek } from 'date-fns';

import { ChartPeriodType, proportionBetween } from '@app/utils/balance.utils';

import ChartPeriod from './ChartPeriod';
import ChartSummary from './ChartSummary';
import { Frame } from './styles';

interface ChartProps {
  chartData: ChartPeriodType[];
}

const Chart = ({ chartData }: ChartProps) => {
  // Determine the highest positive balance
  const peakPositive = Math.max(
    ...chartData.map(peak => {
      return peak.balance > 0 ? peak.balance : 0;
    })
  );

  // Determine the highest negative balance
  const peakNegative = Math.min(
    ...chartData.map(peak => {
      return peak.balance < 0 ? peak.balance : 0;
    })
  );

  // Calculate the range of all positive and negative values from each period
  const positiveBalance = peakPositive;
  const negativeBalance = Math.abs(peakNegative);
  const balanceRange = peakPositive + negativeBalance;

  // Calculate the ratio between the positive and negative balances
  // and returns fr values for CSS grid-template-rows
  const balanceProportion = () => {
    const positiveProportion = proportionBetween(positiveBalance, balanceRange);
    const negativeProportion = proportionBetween(negativeBalance, balanceRange);

    if (positiveProportion === 0 && negativeProportion === 0) {
      return `repeat(2, 1fr)`;
    } else {
      return `
        ${proportionBetween(positiveBalance, balanceRange)}fr
        ${proportionBetween(negativeBalance, balanceRange)}fr
      `; // i.e. 0.85fr 0.15fr
    }
  };

  const [activeBalance, setActiveBalance] = useState(chartData[chartData.length - 1]);

  const handleMouseEnter = (selectedId: number) => {
    setActiveBalance(chartData.find(({ id }) => id === selectedId) as ChartPeriodType);
  };

  return (
    <Frame columns={chartData.length}>
      {chartData.map((period, index) => {
        return (
          <ChartPeriod
            key={period.id}
            id={period.id}
            balance={period.balance}
            balanceProportion={balanceProportion()}
            peakPositiveBalance={peakPositive}
            peakNegativeBalance={peakNegative}
            isCurrentPeriod={index === chartData.length - 1}
            isStartOfYear={period.month ? getWeek(period.month) === 1 : false}
            isActive={activeBalance.id === period.id}
            isCompact={chartData.length > 12}
            label={period.label}
            handleMouseEnter={handleMouseEnter}
          />
        );
      })}
      <ChartSummary periodsLength={chartData.length} activeBalance={activeBalance} />
    </Frame>
  );
};

export default Chart;
