import { ClusterOutlined, HighlightOutlined } from '@ant-design/icons';
import {
  EllipsisTooltip,
  SceneCode,
  SpaceBetweenWrapper,
  TooltipButton,
  useArexPaneProps,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Badge, Menu, Space, theme } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { PlanItemStatistics, SubScene } from '@/services/ReportService';

import { MarkExclusionModalProps } from './MarkExclusionModal';

export interface SubSceneMenuProps {
  data: SubScene[];
  onClick?: (recordId: string) => void;
  onMarkExclusion?: (params: MarkExclusionModalProps) => void;
  onClickAllDiff?: (recordId: string, label: React.ReactNode[]) => void;
}

const Connector = '%_%';
const SubScenesMenu: FC<SubSceneMenuProps> = (props) => {
  const { token } = theme.useToken();

  const { data: plan } = useArexPaneProps<PlanItemStatistics>();

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
            <>
              <SpaceBetweenWrapper>
                <div style={{ overflow: 'hidden' }}>{fullPath}</div>

                <div>
                  <TooltipButton
                    type='link'
                    size='small'
                    icon={<HighlightOutlined />}
                    title={'MarkExclusion'}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onMarkExclusion?.({
                        planId: plan!.planId,
                        planItemId: plan!.planItemId,
                        recordId: subScene.recordId,
                        feedbackType: subScene.feedbackType,
                        remark: subScene.remark,
                      });
                    }}
                  />

                  <TooltipButton
                    type='link'
                    size='small'
                    icon={<ClusterOutlined />}
                    title={'view all'}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onClickAllDiff?.(subScene.recordId, fullPath);
                    }}
                  />
                </div>
              </SpaceBetweenWrapper>
            </>
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
