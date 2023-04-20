import { Card, Drawer } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';

import { CompareResultDetail } from '../../../services/Replay.type';
import DiffPath from '../../DiffPath';
import { DiffPathTooltipProps } from '../../DiffPath/DiffPathTooltip';

export interface DIffDrawer {
  open: boolean;
  title?: string | ReactNode[];
  mode?: DiffPathTooltipProps['mode'];
  appId: string;
  operationId: string;
  data?: CompareResultDetail | CompareResultDetail[];
  loading?: boolean;
  onClose: (open: false) => void;
}

const DiffDrawer: FC<DIffDrawer> = (props) => {
  const { mode = 'single' } = props;
  const diffList = useMemo(
    () => (Array.isArray(props.data) ? props.data : props.data ? [props.data] : []),
    [props.data],
  );

  return (
    <Drawer
      destroyOnClose
      open={props.open}
      title={Array.isArray(props.data) ? props.title : props.data?.operationName}
      bodyStyle={{ padding: 0 }}
      width='80%'
      onClose={() => props.onClose?.(false)}
    >
      <Card bordered={false} bodyStyle={{ padding: '0 16px' }} style={{ minHeight: '100%' }}>
        {/* force destroyOnClose */}
        {props.open && (
          <DiffPath
            mode={mode}
            appId={props.appId}
            operationId={props.operationId}
            defaultOnlyFailed={mode === 'multiple'}
            loading={props.loading}
            data={diffList}
          />
        )}
      </Card>
    </Drawer>
  );
};

export default DiffDrawer;
