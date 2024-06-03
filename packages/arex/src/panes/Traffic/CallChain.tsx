import { css } from '@arextest/arex-core';
import { Card, theme } from 'antd';
import React, { FC } from 'react';
import Tree from 'react-d3-tree';

const CallChain: FC<{ endpoint?: string }> = (props) => {
  const { token } = theme.useToken();

  const mockData = [
    {
      name: props.endpoint || '',
      children: [
        {
          name: 'java.lang.System.currentTime',
          type: 'DynamicClass',
        },
        {
          name: 'java.lang.System.currentTimeMillis',
          type: 'DynamicClass',
        },
        {
          name: 'query',
          type: 'Database',
        },
        {
          name: 'query1',
          type: 'Database',
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
        renderCustomNodeElement={(rd3tProps) => {
          const height = 48;
          const width = rd3tProps.nodeDatum.__rd3t.depth === 0 ? 120 : 240;
          return (
            <g onClick={rd3tProps.toggleNode}>
              <rect
                fill={token.colorBgLayout}
                stroke={token.colorBorder}
                width={width}
                height={height}
                rx={6}
                y={-24}
              />
              <foreignObject
                stroke='none'
                height='100%'
                width='100%'
                y={rd3tProps.nodeDatum.__rd3t.depth === 0 ? -12 : -20}
                x={12}
              >
                <div
                  style={{
                    color: token.colorText,
                  }}
                >
                  <div
                    style={
                      rd3tProps.nodeDatum.__rd3t.depth === 0
                        ? { fontSize: token.fontSizeLG, fontWeight: 500 }
                        : undefined
                    }
                  >
                    {rd3tProps.nodeDatum.name}
                  </div>
                  <div style={{ color: token.colorTextSecondary, fontWeight: 500 }}>
                    {rd3tProps.nodeDatum.type}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        }}
      />
    </Card>
  );
};

export default CallChain;
