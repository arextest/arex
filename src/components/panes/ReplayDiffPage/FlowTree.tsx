import { css } from '@emotion/react';
import { Badge, Space, theme, Typography } from 'antd';
import React, { FC, useCallback } from 'react';
import Tree from 'react-d3-tree';

export interface FlowTreeProps {
  data: any;
}

const FlowTree: FC<FlowTreeProps> = (props) => {
  const { token } = theme.useToken();
  const renderNodeWithCustomEvents = useCallback(
    ({ nodeDatum, handleNodeClick }) => (
      <g>
        {nodeDatum.level === 0 ? (
          <g>
            <rect
              fill={token.colorBgContainer}
              stroke={token.colorBorder}
              width={100}
              height={48}
              rx={6}
              y={-24}
              onClick={() => handleNodeClick(nodeDatum)}
            />
            <text
              fill={token.colorText}
              x={50}
              height={24}
              strokeWidth={0}
              fontSize={token.fontSizeLG}
              fontWeight={500}
              onClick={() => handleNodeClick(nodeDatum)}
              dominantBaseline='middle'
              textAnchor='middle'
            >
              {nodeDatum.name}
            </text>
          </g>
        ) : nodeDatum.level === 1 ? (
          <g>
            <rect
              fill={token.colorBgContainer}
              stroke={token.colorBorder}
              width={200}
              height={100}
              rx={6}
              x={-30}
              y={-50}
              onClick={() => handleNodeClick(nodeDatum)}
            />
            <text
              fill={token.colorText}
              x={70}
              y={-12}
              height={50}
              strokeWidth={0}
              fontSize={token.fontSizeLG}
              fontWeight={400}
              onClick={() => handleNodeClick(nodeDatum)}
              dominantBaseline='middle'
              textAnchor='middle'
            >
              {nodeDatum.name}
            </text>

            <text
              fill={token.colorText}
              x={70}
              y={12}
              height={50}
              strokeWidth={0}
              fontSize={token.fontSize}
              fontWeight={400}
              onClick={() => handleNodeClick(nodeDatum)}
              dominantBaseline='middle'
              textAnchor='middle'
            >
              Attribute
            </text>
            <br />
          </g>
        ) : (
          <g>
            <rect
              fill={token.colorBgContainer}
              stroke={token.colorBorder}
              width={300}
              height={30}
              rx={6}
              y={-15}
              onClick={() => handleNodeClick(nodeDatum)}
            />

            <foreignObject x={12} y={-10} width={280} height={28}>
              <Space>
                <Badge status='error' />

                <Typography.Text ellipsis style={{ width: '260px' }}>
                  longlonglonglonglonglonglonglonglonglongtext
                </Typography.Text>
              </Space>
            </foreignObject>
          </g>
        )}
      </g>
    ),
    [token],
  );

  const handleNodeClick = (nodeDatum) => {
    console.log(nodeDatum);
  };

  return (
    <div
      id='treeWrapper'
      css={css`
        width: 800px;
        height: 300px;
        .rd3t-link {
          stroke: ${token.colorBorder}!important;
        }
      `}
    >
      <Tree
        data={props.data}
        nodeSize={{ x: 240, y: 40 }}
        renderCustomNodeElement={(rd3tProps) =>
          renderNodeWithCustomEvents({ ...rd3tProps, handleNodeClick })
        }
      />
    </div>
  );
};

export default FlowTree;
