import Icon, { ClusterOutlined } from '@ant-design/icons';
import {
  css,
  EllipsisTooltip,
  Label,
  SceneCode,
  SpaceBetweenWrapper,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { Badge, Menu, Space, theme, Tooltip, Typography } from 'antd';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { SubScene } from '@/services/ReportService';

import { FeedbackIconMap, MarkExclusionModalProps } from './MarkExclusionModal';

export interface SubSceneMenuProps {
  planId: string;
  planItemId: string;
  data: SubScene[];
  onClick?: (recordId: string) => void;
  onMarkExclusion?: (params: MarkExclusionModalProps) => void;
  onClickAllDiff?: (recordId: string, label: React.ReactNode[]) => void;
}

const Connector = '%_%';
const SubScenesMenu: FC<SubSceneMenuProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation('components');

  const [selectedKeys, setSelectedKeys] = useState('');

  const feedBackLabel = useMemo(
    () => ['UnknownType', t('replay.bug'), t('replay.asExpectation'), t('replay.arexProblem')],
    [t],
  );

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
              style={{ marginRight: '4px' }}
            />,
          ],
        );

        return {
          label: (
            <SpaceBetweenWrapper style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: -token.marginMD + 1,
                  top: -token.marginMD + 5,
                  zIndex: '10',
                }}
              >
                {subScene?.feedbackType && (
                  <Tooltip
                    title={
                      <>
                        <Typography.Text strong style={{ display: 'block' }}>
                          <Label>{t('replay.markExclusion')}</Label>
                          <Icon component={FeedbackIconMap[subScene.feedbackType]} />{' '}
                          {feedBackLabel[subScene.feedbackType]}
                        </Typography.Text>
                        <Typography.Text>
                          <Label>{t('replay.remark')}</Label> {subScene.remark}
                        </Typography.Text>
                      </>
                    }
                  >
                    <Icon
                      key='feedbackType'
                      component={FeedbackIconMap[subScene.feedbackType]}
                      css={css`
                        color: ${token.colorTextDescription};
                        & > span {
                          font-size: ${token.fontSizeLG}px !important;
                        }
                      `}
                    />
                  </Tooltip>
                )}
              </div>

              <div style={{ overflow: 'hidden' }}>{fullPath}</div>

              <div>
                {/*<TooltipButton*/}
                {/*  type='link'*/}
                {/*  size='small'*/}
                {/*  icon={<HighlightOutlined />}*/}
                {/*  title={t('replay.markExclusion')}*/}
                {/*  onClick={(e) => {*/}
                {/*    e.stopPropagation();*/}
                {/*    props.onMarkExclusion?.({*/}
                {/*      planId: props.planId,*/}
                {/*      planItemId: props.planItemId,*/}
                {/*      recordId: subScene.recordId,*/}
                {/*      feedbackType: subScene.feedbackType,*/}
                {/*      remark: subScene.remark,*/}
                {/*    });*/}
                {/*  }}*/}
                {/*/>*/}

                <TooltipButton
                  type='link'
                  size='small'
                  icon={<ClusterOutlined />}
                  title={t('replay.viewAll')}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onClickAllDiff?.(subScene.recordId, fullPath);
                  }}
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
        .ant-menu-item {
          overflow: visible;
        }
      `}
    />
  );
};

export default SubScenesMenu;
