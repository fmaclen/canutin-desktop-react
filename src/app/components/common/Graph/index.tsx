import React, { useState } from 'react';
import styled from 'styled-components';
import NumberFormat from '@components/common/NumberFormat';
import {
  BarChart,
  Bar,
  XAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList,
  Tooltip,
  CartesianAxis,
} from 'recharts';

import {
  greenPlain,
  greenLight,
  redPlain,
  redLight,
  borderGrey,
  grey20,
  grey3,
  whitePlain,
  grey50,
} from '@app/constants/colors';
import { frame, value } from './styles';
import { ChartPeriodType } from '@app/utils/balance.utils';
import ChartSummary from '../Chart/ChartSummary';
import { CardAppearanceEnum } from '../Card';
import { AnyPtrRecord } from 'dns';
import { monospaceRegular } from '@app/constants/fonts';
import { EntityRepository } from 'typeorm';

interface ChartProps {
  chartData: ChartPeriodType[];
}

const Frame = styled.div`
  ${frame}
`;
const Amount = styled(NumberFormat)`
  ${value}
`;

const Chart = ({ chartData }: ChartProps) => {
  const [activeIndex, setActiveIndex] = useState(chartData.length - 1);

  const handleMouseOver = (_: any, i: any) => {
    setActiveIndex(i);
  };

  return (
    <Frame>
      <ResponsiveContainer width={'100%'} height={320}>
        <BarChart
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barGap={0}
          barCategoryGap={1}
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: '11px' }}
            orientation={'top'}
          />
          <Tooltip
            animationDuration={0}
            cursor={{ fill: grey3 }}
            content={({ active, payload, label }: any) => {
              const balance = active && payload[0].payload.balance;
              return (
                <Amount
                  style={{ color: balance === 0 ? grey50 : balance > 0 ? greenPlain : redPlain }}
                  value={balance}
                  displayType="text"
                />
              );
            }}
          />
          <ReferenceLine y={0} stroke={borderGrey} isFront={true} />
          {chartData.map(entry => {
            return (
              <ReferenceLine
                x={entry.label}
                stroke={entry.label === 'Jan' ? borderGrey : borderGrey}
                strokeDasharray={entry.label === 'Jan' ? 5 : 0}
                position={'start'}
              />
            );
          })}
          <Bar dataKey="balance" onMouseOver={handleMouseOver} style={{ cursor: 'pointer' }}>
            {chartData.map((entry, i) => (
              <>
                <Cell
                  fill={
                    entry.balance === 0
                      ? grey20
                      : entry.balance > 0
                      ? i === activeIndex
                        ? greenPlain
                        : greenLight
                      : i === activeIndex
                      ? redPlain
                      : redLight
                  }
                />
              </>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartSummary periodsLength={chartData.length} activeBalance={chartData[activeIndex]} />
    </Frame>
  );
};

export default Chart;
