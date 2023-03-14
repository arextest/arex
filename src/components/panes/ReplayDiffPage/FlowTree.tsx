import { css } from '@emotion/react';
import { Badge, Space, theme, Typography } from 'antd';
import React, { FC, useCallback } from 'react';
import Tree from 'react-d3-tree';

import { infoItem } from '../../../services/Replay.type';
import { SceneCodeMap } from './index';

export type FlowTreeItem = { name: string; level: number } & infoItem;
export type FlowTreeData = FlowTreeItem & {
  children: FlowTreeItem[];
};
export interface FlowTreeProps {
  data: FlowTreeData;
  onClick?: (id: string) => void;
}

const FlowTree: FC<FlowTreeProps> = (props) => {
  const { token } = theme.useToken();
  const renderNodeWithCustomEvents = useCallback(
    ({
      nodeDatum,
      handleNodeClick,
    }: {
      nodeDatum: FlowTreeData;
      handleNodeClick: (nodeDatum: FlowTreeData) => void;
    }) => (
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
            />
            <text
              fill={token.colorText}
              x={50}
              height={24}
              strokeWidth={0}
              fontSize={token.fontSizeLG}
              fontWeight={500}
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
            />

            <text
              fill={token.colorText}
              x={70}
              y={-12}
              height={50}
              strokeWidth={0}
              fontSize={token.fontSizeLG}
              fontWeight={400}
              dominantBaseline='middle'
              textAnchor='middle'
            >
              {nodeDatum.name}
            </text>

            <foreignObject x={-18} y={-48} width={20} height={20}>
              <Badge color={SceneCodeMap[nodeDatum.code]?.color} />
            </foreignObject>

            <foreignObject x={-10} y={0} width={164} height={28}>
              <Typography.Text ellipsis>{nodeDatum.operationName}</Typography.Text>
            </foreignObject>
          </g>
        ) : (
          <g onClick={() => handleNodeClick(nodeDatum)}>
            <rect
              fill={token.colorBgContainer}
              stroke={token.colorBorder}
              width={300}
              height={30}
              rx={6}
              y={-15}
            />

            <foreignObject x={12} y={-10} width={280} height={28}>
              <Space>
                <Badge color={SceneCodeMap[nodeDatum.code].color} />

                <Typography.Text ellipsis style={{ width: '260px' }}>
                  {nodeDatum.name} - {nodeDatum.operationName}
                </Typography.Text>
              </Space>
            </foreignObject>
          </g>
        )}
      </g>
    ),
    [token],
  );

  const handleNodeClick = (nodeDatum: FlowTreeItem) => {
    props.onClick?.(nodeDatum.id);
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
