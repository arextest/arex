import { ClusterOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Divider, Menu, Space, theme } from 'antd';
import { EllipsisTooltip, SceneCode, SpaceBetweenWrapper, TooltipButton } from 'arex-core';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { SubScene } from '@/services/ReportService';

export interface SubSceneMenuProps {
  data: SubScene[];
  onClick?: (recordId: string) => void;
  onClickAllDiff?: (recordId: string, label: React.ReactNode[]) => void;
}

const Connector = '%_%';
const SubScenesMenu: FC<SubSceneMenuProps> = (props) => {
  const { token } = theme.useToken();
  const [selectedKeys, setSelectedKeys] = useState('');

  useEffect(() => {
    if (props.data.length) {
      const params = {
        recordId: props.data[0].recordId,
        replayId: props.data[0].replayId,
      };
      setSelectedKeys(params.recordId + Connector + params.replayId);
      props.onClick?.(props.data[0].recordId);
    }
  }, [props.data]);

  const handleClick = ({ key }: { key: string }) => {
    setSelectedKeys(key);
    const split = key.split(Connector);
    if (split.length !== 2) return;

    const [recordId, replayId] = split;

    props.onClick?.(recordId);
  };

  return (
    <Menu
      selectedKeys={[selectedKeys]}
      items={props.data.map((subScene) => {
        const fullPath = subScene.details.reduce<ReactNode[]>(
          (path, item, index) => {
            const detail = (
              <Space key={`${item.operationName}-${item.categoryName}`}>
                <EllipsisTooltip title={item.operationName} />
                {`- ${item.categoryName}`}
                <SceneCode code={item.code} />
              </Space>
            );
            index && path.push('+ ');
            path.push(detail);
            return path;
          },
          [
            <Badge
              key='count'
              size='small'
              count={subScene.count}
              color={token.colorPrimary}
              offset={[0, -2]}
              style={{ marginRight: '8px' }}
            />,
          ],
        );

        return {
          label: (
            <SpaceBetweenWrapper>
              <div style={{ overflow: 'hidden' }}>{fullPath}</div>
              <div>
                <Divider type='vertical' />
                <TooltipButton
                  type='link'
                  size='small'
                  icon={<ClusterOutlined />}
                  title={'view all'}
                  onClick={() => props.onClickAllDiff?.(subScene.recordId, fullPath)}
                />
              </div>
            </SpaceBetweenWrapper>
          ),
          key: subScene.recordId + Connector + subScene.replayId,
        };
      })}
      onClick={handleClick}
      css={css`
        border-inline-end: none !important;
      `}
    />
  );
};

export default SubScenesMenu;
