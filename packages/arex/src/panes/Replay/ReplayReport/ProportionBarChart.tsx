import { css } from '@arextest/arex-core';
import { theme, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { getPercent } from '@/panes/Replay/ReplayReport/ReportOverview';

interface ProportionBarChartProps {
  width?: number;
  height?: number;
  percent?: boolean;
  data: [number, number, number, number];
}

const ProportionBarChart: FC<ProportionBarChartProps> = (props) => {
  const { width = 36, height = 12, percent, data } = props;
  const { token } = theme.useToken();
  const total = useMemo(() => data[0] + data[1] + data[2] + data[3], [data]);
  return (
    <div
      css={css`
        display: flex;
        width: ${width}px;
        height: ${height}px;
        margin-left: 8px;
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

      {percent && (
        <div
          style={{
            position: 'absolute',
            width: width + 'px',
            height: height + 'px',
            textAlign: 'center',
            top: 0,
            lineHeight: height * 2 + 2 + 'px',
          }}
        >
          <Typography.Text style={{ color: '#fff', fontSize: '10px' }}>
            {getPercent(data[0], data[0] + data[1] + data[2] + data[3])}
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default ProportionBarChart;
