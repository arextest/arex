import { css } from '@emotion/react';
import { Badge, Tabs, Tag } from 'antd';
import { FC, useMemo } from 'react';
import React from 'react';

import { ArexRESTResponse } from '../../helpers/types/ArexRESTResponse';
import Console from '../http/Console';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{
  response: ArexRESTResponse;
  testResult: any;
  consoles: any[];
}> = ({ response, testResult, consoles }) => {
  const headers = useMemo(() => {
    if (response.type === 'success') {
      return response.headers;
    } else {
      return [];
    }
  }, [response]);
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
          {'Headers'}{' '}
          <Tag
            css={css`
              display: ${headers.length > 0 ? 'inline-block' : 'none'};
            `}
          >
            {headers.length}
          </Tag>
        </div>
      ),
      key: '2',
      // @ts-ignore
      children: <LensesHeadersRenderer headers={response.headers} />,
    },
    {
      label: (
        <div>
          {'Result'}{' '}
          <Badge
            color={'blue'}
            css={css`
              display: ${testResult.length > 0 ? 'inline-block' : 'none'};
            `}
          />
        </div>
      ),
      key: '3',
      children: <TestResult testResult={testResult} />,
    },
    {
      label: (
        <div>
          {'Console'}{' '}
          <Badge
            color={'blue'}
            css={css`
              display: ${consoles.length > 0 ? 'inline-block' : 'none'};
            `}
          />
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
