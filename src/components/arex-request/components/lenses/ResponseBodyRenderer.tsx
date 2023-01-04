import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { FC, useMemo } from 'react';
import React from 'react';

import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../../helpers/types/HoppTestResult';
import { HttpProps, Tab } from '../../index';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import { LensesHeadersRendererEntryProps } from './HeadersRendererEntry';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{
  response: HoppRESTResponse;
  testResult: HoppTestResult;
  onPin: LensesHeadersRendererEntryProps['onPin'];
  config: HttpProps['config'];
}> = ({ response, testResult, onPin, config }) => {
  const items = useMemo(() => {
    let _items: Tab[] = [
      {
        label: 'JSON',
        key: '0',
        children: <JSONLensRenderer response={response} />,
      },
      {
        label: 'Raw',
        key: '1',
        children: <RawLensRenderer response={response} />,
      },
      {
        label: 'Headers',
        key: '2',
        children: <LensesHeadersRenderer onPin={onPin} headers={response.headers} />,
      },
      {
        label: 'Result',
        key: '3',
        children: <TestResult testResult={testResult} />,
      },
    ];
    // concat extra response tabs
    config?.responseTabs?.extra?.length &&
      _items.push(...config.responseTabs.extra.filter((e) => !e.hidden));

    // filter tabs
    config?.responseTabs?.filter &&
      (_items = _items.filter((tab) => config?.responseTabs?.filter?.(tab.key)));
    return _items;
  }, [config?.responseTabs, response, testResult]);

  return (
    <div
      css={css`
        flex: 1;
        .ant-tabs-content-holder {
          height: 100px;
        }
      `}
    >
      <Tabs style={{ height: '100%' }} items={items} />
    </div>
  );
};

export default LensesResponseBodyRenderer;
