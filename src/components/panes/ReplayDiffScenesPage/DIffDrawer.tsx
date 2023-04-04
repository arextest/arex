import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Drawer } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';

import { CompareResultDetail } from '../../../services/Replay.type';
import DiffJsonViewTooltip from '../../replay/Analysis/DiffJsonView/DiffJsonViewTooltip';
import { EmptyWrapper } from '../../styledComponents';
import DiffScenes from './DiffScenes';

export interface DIffDrawer {
  open: boolean;
  title?: string | ReactNode[];
  appId: string;
  operationId: string;
  data?: CompareResultDetail | CompareResultDetail[];
  loading?: boolean;
  onClose: (open: false) => void;
}

const DiffDrawer: FC<DIffDrawer> = (props) => {
  const diffList = useMemo(
    () => (Array.isArray(props.data) ? props.data : [props.data]),
    [props.data],
  );

  return (
    <Drawer
      destroyOnClose
      open={props.open}
      title={Array.isArray(props.data) ? props.title : props.data?.operationName}
      bodyStyle={{ padding: '0 16px' }}
      width='80%'
      onClose={() => props.onClose?.(false)}
    >
      <EmptyWrapper loading={props.loading} empty={!props.data}>
        <DiffJsonViewTooltip />

        <Allotment
          vertical
          minSize={48}
          css={css`
            height: ${diffList.length * 400 || 200}px;
          `}
        >
          {diffList.map((data, index) => (
            <Allotment.Pane
              key={data?.id}
              css={css`
                padding: ${!index ? 0 : '16px'} 16px 0;
                height: 100%;
              `}
            >
              <DiffScenes
                hiddenTooltip
                appId={props.appId}
                operationId={props.operationId}
                height={'100%'}
                data={data as CompareResultDetail}
              />
            </Allotment.Pane>
          ))}
        </Allotment>
      </EmptyWrapper>
    </Drawer>
  );
};

export default DiffDrawer;
