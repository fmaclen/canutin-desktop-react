import React, { useState } from 'react';
import styled from 'styled-components';
import NumberFormat from '@components/common/NumberFormat';
import {
  BarChart,
  Bar,
  XAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
  YAxis,
  CartesianAxis,
  CartesianGrid,
} from 'recharts';

import {
  greenPlain,
  greenLight,
  redPlain,
  redLight,
  borderGrey,
  grey20,
  grey3,
} from '@app/constants/colors';
import { frame, value } from './styles';
import { ChartPeriodType } from '@app/utils/balance.utils';
import ChartSummary from '../Chart/ChartSummary';
import { CardAppearanceEnum } from '../Card';

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
  return (
    <Frame>
      <ResponsiveContainer width={'100%'} height={320}>
        <BarChart
          data={chartData}
          margin={{
            top: 32,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barGap={0}
          barCategoryGap={0}
        >
          <CartesianAxis orientation={'left'} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
          <CartesianAxis tick={true} />
          <Tooltip
            formatter={(value: number) => (
              <NumberFormat
                value={value}
                displayType="text"
                renderText={formattedValue => formattedValue}
              />
            )}
            animationDuration={0}
            itemStyle={{ color: greenPlain }}
            cursor={{ fill: grey3 }}
          />
          <ReferenceLine y={1} stroke={borderGrey} />
          {chartData.map(entry => (
            <ReferenceLine key={entry.id} x={entry.label} stroke={borderGrey} position={'start'} />
          ))}
          <Bar dataKey="balance">
            {chartData.map(entry => (
              <>
                {entry.balance !== 0 && (
                  <>
                    <LabelList
                      key={entry.id}
                      dataKey="balance"
                      position="top"
                      formatter={(value: number) => Math.floor(value)}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'Decima Mono Pro, monospace',
                        borderTop: '5px dashed purple',
                      }}
                    />
                  </>
                )}
                <Cell
                  style={{ borderTop: '5px dashed purple' }}
                  fill={entry.balance === 0 ? grey20 : entry.balance > 0 ? greenPlain : redPlain}
                />
              </>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartSummary periodsLength={chartData.length} activeBalance={chartData[11]} />
    </Frame>
  );
};

export default Chart;
