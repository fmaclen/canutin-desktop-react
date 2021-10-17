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

  const CustomBar = (props: any) => {
    const { fill, x, y, width, height } = props;

    return props.balance === 0 ? (
      // Don't render a bar when the balance is 0
      <></>
    ) : props.balance > 0 ? (
      // Positive value bars
      <>
        <rect x={x} y={y} width={width} height="3" fill={greenPlain} />
        <rect x={x} y={y + 3} width={width} height={height - 3} fill={fill} />
      </>
    ) : (
      // Negative value bars
      <>
        <rect x={x} y={y + height} width={width} height={height * -1 + 3} fill={fill} />
        <rect x={x} y={y > 3 ? y + 3 : y} width={width} height="3" fill={redPlain} />
      </>
    );
  };

  return (
    <Frame>
      <ResponsiveContainer width={'100%'} height={384}>
        <BarChart
          data={chartData}
          margin={{
            top: 12,
            right: 0,
            left: 0,
            bottom: chartData.length > 52 ? 12 : 0,
          }}
          barGap={0}
          barCategoryGap={0.5}
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: '11px' }}
            orientation={'bottom'}
            hide={chartData.length > 52}
          />
          <Tooltip animationDuration={0} cursor={{ fill: grey3 }} content={<HandleContent />} />
          <ReferenceLine y={0} stroke={borderGrey} isFront={true} />
          {chartData.map(entry => {
            return (
              <ReferenceLine
                x={entry.label}
                stroke={borderGrey}
                strokeDasharray={entry.label === 'Jan' ? 8 : 0}
                position={'start'}
              />
            );
          })}
          <Bar dataKey="balance" shape={CustomBar}>
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
      <ChartSummary activeBalance={activePayload} />
    </Frame>
  );
};

export default Chart;
