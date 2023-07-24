import { FilterOutlined } from '@ant-design/icons';
import { EllipsisTooltip, SceneCodeMap, TooltipButton, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Badge, Space, Switch, theme, Typography } from 'antd';
import { cloneDeep } from 'lodash';
import React, { FC, useCallback, useMemo, useState } from 'react';
import Tree from 'react-d3-tree';

import { InfoItem } from '@/services/ReportService';

export interface FlowTreeItem extends InfoItem {
  name: string;
  level: number;
}
export interface FlowTreeData extends FlowTreeItem {
  children?: FlowTreeData[];
}
export interface FlowTreeProps {
  data?: FlowTreeData;
  bordered?: boolean;
  width?: number | string;
  height?: number | string;
  onClick?: (data: FlowTreeData) => void;
}

const FlowTree: FC<FlowTreeProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);

  const [failedOnly, setFailedOnly] = useState<boolean>(true);

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
              fill={token.colorBgLayout}
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
          <g onClick={() => handleNodeClick(nodeDatum)}>
            <rect
              fill={token.colorBgLayout}
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
              fontWeight={500}
              dominantBaseline='middle'
              textAnchor='middle'
            >
              {nodeDatum.name}
            </text>

            <foreignObject x={-18} y={-48} width={20} height={20}>
              <Badge color={SceneCodeMap[nodeDatum.code]?.color} />
            </foreignObject>

            <foreignObject x={-10} y={0} width={164} height={28}>
              <EllipsisTooltip
                ellipsis
                separator={false}
                title={nodeDatum.operationName}
                placement='bottom'
              />
            </foreignObject>
          </g>
        ) : (
          <g onClick={() => handleNodeClick(nodeDatum)}>
            <rect
              fill={token.colorBgLayout}
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
                  {nodeDatum.categoryName} -{' '}
                  <EllipsisTooltip placement='bottom' title={nodeDatum.operationName} />
                </Typography.Text>
              </Space>
            </foreignObject>
          </g>
        )}
      </g>
    ),
    [token],
  );

  return (
    <div
      id='treeWrapper'
      css={css`
        width: ${props.width || '800px'};
        height: ${props.height || '400px'};
        border: ${props.bordered ? `1px solid ${token.colorBorder}` : 'none'};
        border-radius: ${token.borderRadius}px;
        background-color: ${token.colorBgContainer};
        .rd3t-link {
          stroke: ${token.colorBorder}!important;
        }
      `}
    >
      <TooltipButton
        tooltipProps={{ trigger: 'click' }}
        icon={<FilterOutlined />}
        title={
          <Space>
            {t('diffPath.viewFailedOnly')}
            <Switch size='small' checked={failedOnly} onChange={setFailedOnly} />
          </Space>
        }
        style={{ color: failedOnly ? token.colorPrimaryActive : undefined }}
      />
      <Tree
        data={props.data}
        nodeSize={{ x: 240, y: 40 }}
        translate={{ x: 100, y: props.height ? parseInt(props.height.toString()) / 2 : 200 }}
        renderCustomNodeElement={(rd3tProps) =>
          // @ts-ignore
          renderNodeWithCustomEvents({ ...rd3tProps, handleNodeClick: props.onClick })
        }
      />
    </div>
  );
};

export default FlowTree;
