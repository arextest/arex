import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { ArexEnvironment } from '@arextest/arex-request';
import { ArexRESTRequest } from '@arextest/arex-request/src';
import { Button, Flex, Popover, Typography } from 'antd';
import React, { FC } from 'react';

import RequestTestStatusBlock, {
  RequestTestStatusBlockProps,
} from '@/panes/BatchRun/RequestTestStatusBlock';
import StatusBlockTooltip from '@/panes/BatchRun/StatusBlockTooltip';

export type RequestTestStatusMapProps = {
  environment?: ArexEnvironment;
  data: ArexRESTRequest[];
  onClick?: RequestTestStatusBlockProps['onClick'];
};
const RequestTestStatusMap: FC<RequestTestStatusMapProps> = (props) => {
  const { t } = useTranslation('page');
  if (!props.data || !Object.values(props.data).length) return null;
  return (
    <div style={{ padding: '0 16px 4px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        {props.data.map((data) => (
          <RequestTestStatusBlock
            key={data.id}
            data={data}
            environment={props.environment}
            onClick={props.onClick}
          />
        ))}
      </div>
      <Flex justify='space-between'>
        <Flex>
          <Typography.Text type='secondary'>{t('batchRunPage.checkRequestDetail')}</Typography.Text>
          <Popover title={<StatusBlockTooltip />} overlayStyle={{ maxWidth: '500px' }}>
            <QuestionCircleOutlined
              style={{
                margin: '0 4px',
                display: Object.values(props.data).length ? 'inherit' : 'none',
              }}
            />
          </Popover>
        </Flex>
        {/*<Button size='small'>查看所有失败请求</Button>*/}
      </Flex>
    </div>
  );
};

export default RequestTestStatusMap;
