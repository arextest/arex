import { css, jsx } from '@emotion/react';
import { Tabs } from 'antd';
import { FC } from 'react';
import React from 'react';

import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../../helpers/types/HoppTestResult';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{
  response: HoppRESTResponse;
  testResult: HoppTestResult;
  onPin: any;
  config: any;
}> = ({ response, testResult, onPin, config }) => {
  const items = [
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
      // @ts-ignore
      children: <LensesHeadersRenderer onPin={onPin} headers={response.headers} />,
    },
    {
      label: 'Result',
      key: '3',
      children: <TestResult testResult={testResult} />,
    },
  ].concat(config.responseTabs.extra.filter((e: any) => !e.hidden));
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
