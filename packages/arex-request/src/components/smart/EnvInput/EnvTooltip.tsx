import { Theme, useArexCoreConfig } from '@arextest/arex-core';
import { Space, Tooltip, Typography } from 'antd';
import React, { FC, PropsWithChildren, useMemo } from 'react';

import { ArexEnvironment } from '../../../types';

export type TooltipContentProps = {
  offset?: number[];
  open?: boolean;
  match: string;
  mockEnvironment?: ArexEnvironment;
};
const EnvTooltip: FC<PropsWithChildren<TooltipContentProps>> = (props) => {
  const { theme } = useArexCoreConfig();
  const env = useMemo(() => {
    const key = props.match.replace('{{', '').replace('}}', '');
    return props.mockEnvironment?.variables?.find((v) => v.key === key);
  }, [props]);

  return (
    <Tooltip
      color={theme === Theme.light ? '#fff' : undefined}
      placement={'topLeft'}
      align={{ offset: props.offset }}
      open={props.open}
      title={
        <div style={{ padding: '2px' }}>
          {env?.value ? (
            <Space size='middle'>
              <Typography.Text strong>{props.mockEnvironment?.name}</Typography.Text>
              <Typography.Text code>{env?.value}</Typography.Text>
            </Space>
          ) : (
            <Space size='middle'>
              <Typography.Text strong> Choose an Environment</Typography.Text>
              <Typography.Text code>Not found</Typography.Text>
            </Space>
          )}
        </div>
      }
    >
      {props.children}
    </Tooltip>
  );
};

export default EnvTooltip;
