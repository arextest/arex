import { Tabs } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpRawBody from './RawBody';
import HttpTests from './Tests';
import HttpParameters from './Parameters';
import { HttpContext } from '../../index';
import { getValueByPath } from '../../helpers/utils/locale';
import { css } from '@emotion/react';
import { useCodeMirror } from '../../helpers/editor/codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';
const { TabPane } = Tabs;
const HttpRequestOptions = ({ data, requestExtraTabItems, theme }) => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(store.locale, key);
  const [activeKey, setActiveKey] = useState('0');
  const testRef = useRef(null);
  useCodeMirror({
    container: testRef.current,
    height: '100%',
    value: JSON.stringify(store.request, null, 2),
    extensions: [json()],
    theme: githubLight,
  });

  // useCodeMirror({
  //   container: jsonResponse.current,
  //   value: response.body,
  //   height: '300px',
  //   extensions: [json()],
  // });

  const items = [
    { label: t('request.parameters'), key: '0', children: <HttpParameters /> }, // 务必填写 key
    // { label: 'form-data', key: '1', children: '内容 2' },
    // { label: 'x-www-form-urlencoded', key: '2', children: '内容 2' },
    { label: 'Headers', key: '1', children: <HttpHeaders data={data} /> },
    { label: 'Body', key: '3', children: <HttpBody theme={theme} data={data} /> },
    { label: 'Tests', key: '4', children: <HttpTests theme={theme} data={data} /> },
    {
      label: 'look',
      key: '-1',
      children: (
        <div
          ref={testRef}
          css={css`
            //position: absolute;
          `}
        ></div>
      ),
    }, // 务必填写 key
    // { label: 'binary', key: '4', children: '内容 2' },
    ...requestExtraTabItems,
  ];
  return (
    <div
      css={css`
        //相当于最小高度
        height: 100px;
        padding-left: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .ant-tabs-content-holder {
          //background-color: salmon;
          //overflow-y: auto;
          //flex: 1;
          //height: 100px;
        }
      `}
    >
      <Tabs
        style={{ height: '100%' }}
        activeKey={activeKey}
        items={items}
        onChange={(val) => {
          setActiveKey(val);
          // console.log(val)
        }}
      ></Tabs>
    </div>
  );
};

export default HttpRequestOptions;
