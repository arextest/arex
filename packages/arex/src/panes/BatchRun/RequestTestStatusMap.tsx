import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { ArexEnvironment, ArexRESTRequest } from '@arextest/arex-request';
import { Card, Flex, Popover, Radio, Typography } from 'antd';
import React, { FC, memo, ReactElement, useMemo, useState } from 'react';

import { RunResult } from '@/panes/BatchRun/BatchRun';
import RequestTestStatusBlock, {
  RequestTestStatusBlockProps,
} from '@/panes/BatchRun/RequestTestStatusBlock';
import StatusBlockTooltip from '@/panes/BatchRun/StatusBlockTooltip';

export type RequestTestStatusMapProps = {
  environment?: ArexEnvironment;
  data: RunResult[];
  selectedKey?: React.Key;
  onClick?: RequestTestStatusBlockProps['onClick'];
};

const UseGuide = memo(() => {
  const { t } = useTranslation('page');
  return (
    <Flex justify='space-between'>
      <Flex>
        <Typography.Text>{t('batchRunPage.checkRequestDetail')}</Typography.Text>
        <Popover title={<StatusBlockTooltip />} overlayStyle={{ maxWidth: '500px' }}>
          <QuestionCircleOutlined
            style={{
              margin: '0 4px',
            }}
          />
        </Popover>
      </Flex>
    </Flex>
  );
});

type GroupBy = 'flat' | 'interface' | 'status' | 'testResult';

const RequestTestStatusMap: FC<RequestTestStatusMapProps> = (props) => {
  const { t } = useTranslation('page');
  const { data } = props;
  const [groupBy, setGroupBy] = useState<GroupBy>('flat');

  if (!data || !Object.values(data).length) return null;

  return (
    <div style={{ padding: '16px 16px 0 16px' }}>
      <Card
        title={<UseGuide />}
        extra={
          <Radio.Group value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <Radio.Button value='flat'>平铺</Radio.Button>
            <Radio.Button value='interface'>接口分组</Radio.Button>
            <Radio.Button value='status'>状态分组</Radio.Button>
            <Radio.Button value='testResult'>测试结果分组</Radio.Button>
          </Radio.Group>
        }
      >
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {data.map((data) => (
            <RequestTestStatusBlock
              key={data.request.id}
              data={data}
              selected={props.selectedKey === data.request.id}
              environment={props.environment}
              onClick={props.onClick}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RequestTestStatusMap;
