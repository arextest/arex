import { css, useArexPaneProps } from '@arextest/arex-core';
import { Card, theme } from 'antd';
import React, { FC, useMemo } from 'react';
import Tree from 'react-d3-tree';

import { decodePaneKey } from '@/store/useMenusPanes';

const CallChain: FC = () => {
  const { token } = theme.useToken();
  const { paneKey } = useArexPaneProps();
  const { id: appId } = useMemo(() => decodePaneKey(paneKey), [paneKey]);

  const mockData = [
    {
      name: appId,
      children: [
        {
          name: '[Servlet] /dbTest/mybatis/query',
        },
        {
          name: '[DynamicClass] java.lang.System.currentTimeMillis',
        },
        {
          name: '[DynamicClass] java.lang.System.currentTime',
        },
        {
          name: '[Database] query',
        },
        {
          name: '[Database] query1',
        },
      ],
    },
  ];

  return (
    <Card
      title='Call Chain'
      css={css`
        .rd3t-link {
          stroke: ${token.colorBorder}!important;
        }
      `}
      style={{ height: '438px' }}
      styles={{
        body: {
          height: '400px',
          padding: 0,
        },
      }}
    >
      <Tree
        data={mockData}
        translate={{
          x: 100,
          y: 184,
        }}
        nodeSize={{
          x: 200,
          y: 64,
        }}
        renderCustomNodeElement={(rd3tProps) => (
          <g onClick={rd3tProps.toggleNode}>
            <rect
              fill={token.colorBgLayout}
              stroke={token.colorBorder}
              width={rd3tProps.nodeDatum.__rd3t.depth === 0 ? 100 : 200}
              height={48}
              rx={6}
              y={-24}
            />
            <text
              stroke='none'
              textAnchor='middle'
              dominantBaseline='middle'
              height={24}
              fill={token.colorText}
              x={rd3tProps.nodeDatum.__rd3t.depth === 0 ? 50 : 100}
            >
              {rd3tProps.nodeDatum.name}
            </text>
          </g>
        )}
      />
    </Card>
  );
};

export default CallChain;
