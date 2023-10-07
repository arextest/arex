import { css } from '@arextest/arex-core';
import { Badge, Tabs, Tag } from 'antd';
import React, { FC, useMemo } from 'react';

import { ArexRESTResponse, ArexTestResult } from '../../types';
import Console from '../http/Console';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

export type LensesResponseBodyRendererProps = {
  response?: ArexRESTResponse;
  testResult?: ArexTestResult[];
  consoles?: any[];
};
const LensesResponseBodyRenderer: FC<LensesResponseBodyRendererProps> = ({
  response,
  testResult,
  consoles,
}) => {
  const headers = useMemo(() => (response?.type === 'success' ? response.headers : []), [response]);

  const items = [
    {
      label: 'JSON',
      key: '0',
      children: <JSONLensRenderer response={response} />,
    },
    // {
    //   label: 'Body',
    //   key: 'Body',
    //   children: <BodySegmented response={response} />,
    // },
    {
      label: 'Raw',
      key: '1',
      children: <RawLensRenderer response={response} />,
    },
    {
      label: (
        <div>
          {'Headers'} {headers.length ? <Tag>{headers.length}</Tag> : null}
        </div>
      ),
      key: '2',
      children: <LensesHeadersRenderer headers={headers} />,
    },
    {
      label: (
        <div>
          {'Result'} {testResult?.length ? <Badge color='blue' /> : null}
        </div>
      ),
      key: '3',
      children: <TestResult testResult={testResult} />,
    },
    {
      label: (
        <div>
          {'Console'} {consoles?.length ? <Badge color='blue' /> : null}
        </div>
      ),
      key: '4',
      children: <Console logs={consoles} />,
    },
  ];

  return (
    <div
      css={css`
        flex: 1;
        .ant-tabs-content-holder {
          height: 100px;
        }
        padding-bottom: 6px;
      `}
    >
      <Tabs style={{ height: '100%' }} items={items} />
    </div>
  );
};

export default LensesResponseBodyRenderer;
