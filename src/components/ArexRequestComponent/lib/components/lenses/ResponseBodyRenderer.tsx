import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { FC, useRef } from 'react';

import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import TestResult from '../http/TestResult';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  // const jsonResponse = useRef(null);

  // useCodeMirror({
  //   container: jsonResponse.current,
  //   value: response.body,
  //   height: '300px',
  //   extensions: [json()],
  // });
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
      children: <TestResult />,
    },
  ];
  return (
    <div
      css={css`
        //相当于最小高度
        //height: 100%;
        //padding-left: 16px;
        flex: 1;
        //display: flex;
        //flex-direction: column;
        .ant-tabs-content-holder {
          //background-color: salmon;
          //overflow-y: auto;
          //flex: 1;
          //height: 100%;
          height: 100px;
        }
      `}
    >
      <Tabs style={{ height: '100%' }} items={items} />
      {/*<div ref={jsonResponse}></div>*/}
    </div>
  );
};

export default LensesResponseBodyRenderer;
