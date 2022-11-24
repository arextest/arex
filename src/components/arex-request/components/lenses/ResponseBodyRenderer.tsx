// @ts-nocheck
import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { FC } from 'react';

import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{ response: HoppRESTResponse; testResult: any }> = ({
  response,
  testResult,
}) => {
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
      children: <LensesHeadersRenderer headers={response.headers} />,
    },
    {
      label: 'Result',
      key: '3',
      children: <TestResult testResult={testResult} />,
    },
  ];
  console.log(response, 'response');
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
