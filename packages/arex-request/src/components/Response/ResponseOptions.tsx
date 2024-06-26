import { SmallBadge } from '@arextest/arex-core';
import { Tabs } from 'antd';
import React, { FC, useMemo } from 'react';

import { Tab } from '../../ArexRequest';
import { useArexRequestProps } from '../../hooks';
import { ArexRESTResponse, ArexTestResult } from '../../types';
import Console from './Console';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';
import ResponseMeta from './ResponseMeta';
import TestResult from './TestResult';

export type LensesResponseBodyRendererProps = {
  response?: ArexRESTResponse;
  testResult?: ArexTestResult[];
  consoles?: any[];
};
const ResponseOptions: FC<LensesResponseBodyRendererProps> = ({
  response,
  testResult,
  consoles,
}) => {
  const { config } = useArexRequestProps();
  const headers = useMemo(() => (response?.type === 'success' ? response.headers : []), [response]);

  const items = useMemo(() => {
    const _items: Tab[] = [
      {
        label: 'Body',
        key: 'body',
        children: <ResponseBody response={response} />,
      },
      {
        key: 'headers',
        label: <SmallBadge count={headers?.length}>Headers</SmallBadge>,
        children: <ResponseHeaders headers={headers} />,
      },
      {
        key: 'result',
        label: <SmallBadge dot={!!testResult?.length}>Result</SmallBadge>,
        children: <TestResult testResult={testResult} />,
      },
      // {
      //   key: 'console',
      //   label: <SmallBadge dot={!!consoles?.length}>Console</SmallBadge>,
      //   children: <Console logs={consoles} />,
      // },
    ];

    return _items.concat(config?.responseTabs?.extra?.filter((tab) => !tab.hidden) || []);
  }, [headers, response, testResult, consoles, config]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        margin: '-8px 0',
      }}
    >
      <Tabs
        defaultValue='body'
        items={items}
        tabBarExtraContent={<ResponseMeta response={response} />}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default ResponseOptions;
