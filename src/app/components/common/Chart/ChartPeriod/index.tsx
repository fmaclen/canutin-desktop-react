import React from 'react';

import { proportionBetween } from '@app/utils/balance.utils';

import { ThemeProvider } from 'styled-components';
import {
  BarNegative,
  BarPositive,
  Period,
  PeriodBalance,
  PeriodBarPlaceholder,
  PeriodBalanceLabel,
  PeriodBar,
  PeriodLabel,
} from './styles';

interface ChartPeriodProps {
  id: number;
  balance: number;
  balanceProportion: string;
  peakPositiveBalance: number;
  peakNegativeBalance: number;
  isActive: boolean;
  isCurrentPeriod: boolean;
  isStartOfYear: boolean;
  isCompact: boolean;
  label: string;
  handleMouseEnter: (id: number) => void;
}

const ChartPeriod = ({
  id,
  balance,
  peakPositiveBalance,
  peakNegativeBalance,
  balanceProportion,
  isActive,
  isCurrentPeriod,
  isStartOfYear,
  isCompact,
  label,
  handleMouseEnter,
}: ChartPeriodProps) => {
  const isBalancePositive = balance >= 0;

  return (
    <ThemeProvider theme={{ isActive, isCurrentPeriod, isStartOfYear, isCompact, label, balance }}>
      <Period onMouseEnter={() => handleMouseEnter(id)}>
        <PeriodBalance proportion={balanceProportion}>
          {isBalancePositive ? (
            <>
              <PeriodBar>
                {!isCompact && (
                  <PeriodBalanceLabel
                    isVisible={
                      isCurrentPeriod ||
                      (peakPositiveBalance !== 0 && peakPositiveBalance === balance)
                    }
                    value={Math.floor(balance)}
                    displayType="text"
                  />
                )}
                <BarPositive height={proportionBetween(balance, peakPositiveBalance)} />
              </PeriodBar>
              <PeriodBarPlaceholder />
            </>
          ) : (
            <>
              <PeriodBarPlaceholder />
              <PeriodBar>
                <BarNegative height={proportionBetween(balance, peakNegativeBalance)} />
                {!isCompact && (
                  <PeriodBalanceLabel
                    isVisible={isCurrentPeriod || peakNegativeBalance === balance}
                    value={Math.floor(balance)}
                    displayType="text"
                  />
                )}
              </PeriodBar>
            </>
          )}
        </PeriodBalance>
        <PeriodLabel>{label}</PeriodLabel>
      </Period>
    </ThemeProvider>
  );
};

export default ChartPeriod;
