import React, { useState } from 'react';
import styled from 'styled-components';
import NumberFormat from '@components/common/NumberFormat';
import { BarChart, Bar, XAxis, ReferenceLine, ResponsiveContainer, Cell, Tooltip } from 'recharts';

import {
  greenPlain,
  greenLight,
  redPlain,
  redLight,
  borderGrey,
  grey20,
  grey3,
  grey50,
} from '@app/constants/colors';
import { frame, value } from './styles';
import { ChartPeriodType } from '@app/utils/balance.utils';
import ChartSummary from '../Chart/ChartSummary';

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
  const [activePayload, setActivePayload] = useState(chartData[chartData.length - 1]);

  const HandleContent = (props: any) => {
    const { active, payload } = props;
    active && activePayload !== payload[0].payload && setActivePayload(payload[0].payload);

    return active ? (
      <Amount
        style={{
          color:
            payload[0].payload.balance === 0
              ? grey50
              : payload[0].payload.balance > 0
              ? greenPlain
              : redPlain,
        }}
        value={payload[0].payload.balance}
        displayType="text"
      />
    ) : (
      <></>
    );
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
          barCategoryGap={0.5}
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: '11px' }}
            orientation={'top'}
          />
          <Tooltip animationDuration={0} cursor={{ fill: grey3 }} content={<HandleContent />} />
          <ReferenceLine y={0} stroke={borderGrey} isFront={true} />
          {chartData.map(entry => {
            return (
              <ReferenceLine
                x={entry.label}
                stroke={entry.label === 'Jan' ? borderGrey : borderGrey}
                strokeDasharray={entry.label === 'Jan' ? 8 : 0}
                position={'start'}
              />
            );
          })}
          <Bar dataKey="balance">
            {chartData.map((entry, i) => (
              <>
                <Cell
                  fill={
                    entry.balance === 0
                      ? grey20
                      : entry.balance > 0
                      ? entry === activePayload
                        ? greenPlain
                        : greenLight
                      : entry === activePayload
                      ? redPlain
                      : redLight
                  }
                />
              </>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ChartSummary periodsLength={chartData.length} activeBalance={activePayload} />
    </Frame>
  );
};

export default Chart;
