import { css } from '@arextest/arex-core';
import { theme } from 'antd';
import React, { FC, useMemo } from 'react';

interface ProportionBarChartProps {
  width?: number;
  height?: number;
  data: [number, number, number, number];
}

const ProportionBarChart: FC<ProportionBarChartProps> = (props) => {
  const { width = 32, height = 12, data } = props;
  const { token } = theme.useToken();
  const total = useMemo(() => data[0] + data[1] + data[2] + data[3], [data]);
  return (
    <div
      css={css`
        display: flex;
        width: ${width}px;
        height: ${height}px;
        margin-left: 8px;
        background-color: ${token.colorSuccessTextHover};
      `}
    >
      <div
        style={{
          height: '100%',
          width: (data[0] * 100) / total + '%',
          backgroundColor: token.colorSuccessTextHover,
        }}
      />
      <div
        style={{
          height: '100%',
          width: (data[1] * 100) / total + '%',
          backgroundColor: token.colorErrorTextHover,
        }}
      />
      <div
        style={{
          height: '100%',
          width: (data[2] * 100) / total + '%',
          backgroundColor: token.colorInfoTextHover,
        }}
      />
      <div
        style={{
          height: '100%',
          width: (data[3] * 100) / total + '%',
          backgroundColor: token.colorWarningTextHover,
        }}
      />
    </div>
  );
};

export default ProportionBarChart;
