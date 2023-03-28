import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Col, Menu, Row, theme, Typography } from 'antd';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import MainMenu from '../../../pages/MainBox/MainMenu';
import MainTabs from '../../../pages/MainBox/MainTabs';
import { CompareResultDetail, DiffLog, PathPair } from '../../../services/Replay.type';
import DiffJsonView, { DiffJsonViewProps } from '../../replay/Analysis/DiffJsonView';
import { FlexCenterWrapper } from '../../styledComponents';

export interface DiffScenesProps extends Pick<DiffJsonViewProps, 'hiddenTooltip'> {
  data?: CompareResultDetail;
  height?: string;
}

const DiffScenes: FC<DiffScenesProps> = (props) => {
  const { token } = theme.useToken();
  const [activeLog, setActiveLog] = useState<DiffLog>();

  useEffect(() => {
    props.data?.logs?.length && setActiveLog((props.data.logs as DiffLog[])[0]);
  }, [props.data]);

  const diffJsonData = useMemo(
    () =>
      props.data?.diffResultCode
        ? activeLog
          ? {
              baseMsg: props.data.baseMsg,
              testMsg: props.data.testMsg,
              logs: [activeLog],
            }
          : undefined
        : {
            baseMsg: props.data?.baseMsg,
            testMsg: props.data?.testMsg,
            logs: [],
          },
    [props.data, activeLog],
  );

  const pathTitle = useCallback((pathPair: PathPair) => {
    const path =
      pathPair.leftUnmatchedPath.length >= pathPair.rightUnmatchedPath.length
        ? pathPair.leftUnmatchedPath
        : pathPair.rightUnmatchedPath;
    return (
      path.reduce((title, curPair, index) => {
        index && (title += '.');
        title += curPair.nodeName || `[${curPair.index}]`;
        return title;
      }, '') || 'root'
    );
  }, []);

  if (!props.data) return null;

  return (
    <Allotment
      css={css`
        height: ${props.height};
      `}
    >
      <Allotment.Pane preferredSize={200}>
        {!props.data?.diffResultCode ? (
          <FlexCenterWrapper>
            <Typography.Text type='secondary'>COMPARED_WITHOUT_DIFFERENCE</Typography.Text>
          </FlexCenterWrapper>
        ) : (
          <Menu
            defaultSelectedKeys={['0']}
            items={props.data.logs?.map((log, index) => {
              return {
                label: (
                  <Typography.Text style={{ color: 'inherit' }}>
                    {pathTitle(log.pathPair)}
                  </Typography.Text>
                ),
                key: index,
              };
            })}
            onClick={({ key }) => {
              props.data && setActiveLog((props.data.logs as DiffLog[])[parseInt(key)]);
            }}
            css={css`
              height: 100%;
              padding: 0 8px;
              .ant-menu-item {
                height: 24px;
                line-height: 24px;
              }
            `}
          />
        )}
      </Allotment.Pane>

      <Allotment.Pane
        visible
        css={css`
          height: ${props.height};
          border-left: 1px solid ${token.colorBorderBg};
          padding-left: 8px;
        `}
      >
        {diffJsonData && (
          <DiffJsonView
            hiddenTooltip={props.hiddenTooltip}
            height={props.height}
            data={diffJsonData}
          />
        )}
      </Allotment.Pane>
    </Allotment>
  );
};

export default DiffScenes;
