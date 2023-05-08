import { StopOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Menu, Spin, theme, Typography } from 'antd';
import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ReplayStatusCode } from '../../constant';
import AppSettingService from '../../services/AppSetting.service';
import ReplayService from '../../services/Replay.service';
import { CompareResultDetail, DiffLog } from '../../services/Replay.type';
import DiffJsonView from '../DiffJsonView';
import { SceneCodeMap } from '../SceneCode';
import { EmptyWrapper, FlexCenterWrapper, SpaceBetweenWrapper } from '../styledComponents';
import TooltipButton from '../TooltipButton';

export interface DiffScenesProps {
  status: ReplayStatusCode;
  operationId: string;
  appId: string;
  loading?: boolean;
  data?: CompareResultDetail;
  height?: string;
  defaultActiveFirst?: boolean;
}

const defaultPath = 'root';

interface PathTitleProps {
  diffLog: DiffLog;
  onIgnore?: (diffLog: DiffLog) => void;
}
const PathTitle = styled((props: PathTitleProps) => {
  const { onIgnore, diffLog, ...restProps } = props;
  const { t } = useTranslation(['components']);

  const pathTitle = useCallback((diffLog: DiffLog) => {
    const path = diffLog.nodePath;
    return (
      path.reduce((title, curPair, index) => {
        index && curPair.nodeName && (title += '.');
        title += curPair.nodeName || `[${curPair.index}]`;
        return title;
      }, '') || defaultPath
    );
  }, []);

  return (
    <SpaceBetweenWrapper {...restProps}>
      <Typography.Text ellipsis style={{ color: 'inherit' }}>
        {pathTitle(diffLog)}
      </Typography.Text>
      <TooltipButton
        size='small'
        color='primary'
        placement='right'
        icon={<StopOutlined />}
        title={t('replay.ignoreNode')}
        className='menu-item-stop-outlined'
        onClick={() => onIgnore?.(diffLog)}
      />
    </SpaceBetweenWrapper>
  );
})`
  height: 100%;
  .menu-item-stop-outlined {
    padding-right: 8px;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  &:hover {
    .menu-item-stop-outlined {
      opacity: 1;
    }
  }
`;

const DiffPathViewer: FC<DiffScenesProps> = (props) => {
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const {
    data: logEntity = [],
    loading: loadingLogEntity,
    run: queryLogEntity,
  } = useRequest(
    (logIndex) =>
      ReplayService.queryLogEntity({
        compareResultId: props.data!.id,
        logIndex,
      }),
    {
      manual: true,
      ready: !!props.data,
    },
  );

  useEffect(() => {
    props.defaultActiveFirst &&
      props.data?.logInfos?.length &&
      queryLogEntity(props.data.logInfos[0].logIndex);
  }, [props.data]);

  const { run: insertIgnoreNode } = useRequest(
    (path) =>
      AppSettingService.insertIgnoreNode({
        operationId: props.operationId,
        appId: props.appId,
        exclusions: path,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success(t('replay.addIgnoreSuccess'));
        }
      },
    },
  );

  function handleIgnoreNode(diffLog: DiffLog) {
    const path = diffLog.nodePath.map((p) => p.nodeName).filter(Boolean);

    insertIgnoreNode(path);
  }

  if (!props.data) return null;

  return (
    <Allotment
      css={css`
        height: ${props.height};
      `}
    >
      <Allotment.Pane preferredSize={200}>
        {[ReplayStatusCode.EXCEPTION, ReplayStatusCode.SUCCESS].includes(props.status) ? (
          <FlexCenterWrapper>
            <Typography.Text type='secondary'>
              {SceneCodeMap[props.status].message.toUpperCase()}
            </Typography.Text>
          </FlexCenterWrapper>
        ) : (
          <>
            <SpaceBetweenWrapper>
              <Typography.Text
                type='secondary'
                style={{
                  display: 'inline-block',
                  margin: `${token.marginSM}px 0 0 ${token.margin}px`,
                }}
              >
                {t('replay.pointOfDifference')}
              </Typography.Text>
              <Spin
                size='small'
                spinning={loadingLogEntity}
                css={css`
                  margin-right: 8px;
                  span {
                    font-size: 16px !important;
                  }
                `}
              />
            </SpaceBetweenWrapper>

            <Menu
              defaultSelectedKeys={props.defaultActiveFirst ? ['0'] : undefined}
              items={props.data.logInfos?.map((log, index) => {
                return {
                  label: <PathTitle diffLog={log} onIgnore={handleIgnoreNode} />,
                  key: index,
                };
              })}
              css={css`
                height: 100%;
                overflow-y: auto;
                padding: 4px 8px 0;
                .ant-menu-item {
                  height: 26px;
                  line-height: 26px;
                }
                border-inline-end: none !important;
              `}
              onClick={({ key }) => {
                props.data?.logInfos?.length &&
                  queryLogEntity(props.data.logInfos[parseInt(key)].logIndex);
              }}
            />
          </>
        )}
      </Allotment.Pane>

      <Allotment.Pane
        visible
        css={css`
          height: ${props.height};
          border-left: 1px solid ${token.colorBorderBg};
        `}
      >
        {props.status === ReplayStatusCode.EXCEPTION ? (
          <FlexCenterWrapper style={{ padding: '16px' }}>
            <Typography.Text type='secondary'>{props.data.exceptionMsg}</Typography.Text>
          </FlexCenterWrapper>
        ) : (
          <EmptyWrapper
            loading={props.loading}
            empty={!props.data}
            style={{ position: 'relative', margin: `${token.marginXS}px`, height: '100%' }}
          >
            <DiffJsonView
              hiddenTooltip
              height={`calc(${props.height} - 16px)`}
              diffJson={{
                left: props.data.baseMsg,
                right: props.data.testMsg,
              }}
              diffPath={logEntity}
            />
          </EmptyWrapper>
        )}
      </Allotment.Pane>
    </Allotment>
  );
};

export default DiffPathViewer;
