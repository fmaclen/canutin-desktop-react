import React, { useState, useEffect } from 'react';

import { TransactionBalanceType } from '@app/utils/balance.utils';

import Period from './ChartPeriod';
import ChartSummary from './ChartSummary';
import { Frame } from './styles';

const proportionBetween = (num1: number, num2: number) => {
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return Math.round((!(num1 === 0) && !(num2 === 0) ? (num1 * 100) / num2 : 0) * 1e2) / 1e2;
  }
  throw new Error('proportionBetween() was provided a string and only accepts numbers');
};

interface ChartProps {
  transactionData: TransactionBalanceType[];
}

const Chart = ({ transactionData }: ChartProps) => {
  // Determine the highest positive balance
  const peakPositive = Math.max(
    ...transactionData.map(peak => {
      return peak.balance > 0 ? peak.balance : 0;
    })
  );

  // Determine the highest negative balance
  const peakNegative = Math.min(
    ...transactionData.map(peak => {
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
    return `
      ${proportionBetween(positiveBalance, balanceRange)}fr
      ${proportionBetween(negativeBalance, balanceRange)}fr
    `; // i.e. 0.85fr 0.15fr
  };

  const [activeBalance, setActiveBalance] = useState(transactionData[transactionData.length - 1]);

  const handleMouseEnter = (selectedId: number) => {
    setActiveBalance(transactionData.find(({ id }) => id === selectedId) as TransactionBalanceType);
  };

  return (
    <Frame columns={transactionData.length}>
      {transactionData.map(period => {
        return (
          <Period
            key={period.id}
            id={period.id}
            balance={period.balance}
            balanceProportion={balanceProportion()}
            peakPositiveBalance={peakPositive}
            peakNegativeBalance={peakNegative}
            isCurrentPeriod={period.id === transactionData.length - 1}
            isActive={activeBalance.id === period.id}
            handleMouseEnter={handleMouseEnter}
          />
        );
      })}
      <ChartSummary periodsLength={transactionData.length} activeBalance={activeBalance} />
    </Frame>
  );
};

export default Chart;
