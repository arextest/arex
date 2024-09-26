import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { ArexEnvironment } from '@arextest/arex-request';
import { Card, Flex, Popover, Radio, Typography } from 'antd';
import React, { FC, memo, ReactElement, useMemo, useState } from 'react';

import { RunResult } from '@/panes/BatchRun/BatchRun';
import { ByInterface } from '@/panes/BatchRun/BatchRunResultGroup/ByInterface';
import { ByStatus } from '@/panes/BatchRun/BatchRunResultGroup/ByStatus';
import { Flat } from '@/panes/BatchRun/BatchRunResultGroup/Flat';
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

  const blockMap = useMemo(() => {
    const result = new Map<RunResult, ReactElement>();
    data.forEach((item) => {
      result.set(
        item,
        <RequestTestStatusBlock
          key={item.request.id}
          data={item}
          selected={item.request.id === props.selectedKey}
          onClick={props.onClick}
        />,
      );
    });
    return result;
  }, [data, props.selectedKey]);

  if (!data || !Object.values(data).length) return null;

  return (
    <div style={{ padding: '16px 16px 0 16px' }}>
      <Card
        title={<UseGuide />}
        extra={
          <Radio.Group value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <Radio.Button value='flat'>{t('batchRunPage.flatten')}</Radio.Button>
            <Radio.Button value='interface'>{t('batchRunPage.groupByInterface')}</Radio.Button>
            <Radio.Button value='status'>{t('batchRunPage.groupByStatus')}</Radio.Button>
          </Radio.Group>
        }
      >
        {groupBy === 'flat' && <Flat blockMap={blockMap} />}
        {groupBy === 'interface' && <ByInterface blockMap={blockMap} />}
        {groupBy === 'status' && <ByStatus blockMap={blockMap} />}
      </Card>
    </div>
  );
};

export default RequestTestStatusMap;
