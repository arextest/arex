import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';
import HttpBody from './Body';
import HttpCompare from './Compare';
import HttpHeaders from './Headers';
import HttpMock from './Mock';
import HttpParameters from './Parameters';
import HttpTests from './Tests';
const HttpRequestOptions = () => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);
  const [activeKey, setActiveKey] = useState('3');
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);

  const items = [
    { label: t('request.parameters'), key: '0', children: <HttpParameters /> }, // 务必填写 key
    // { label: 'form-data', key: '1', children: '内容 2' },
    // { label: 'x-www-form-urlencoded', key: '2', children: '内容 2' },
    { label: 'Headers', key: '1', children: <HttpHeaders /> },
    { label: 'Body', key: '3', children: <HttpBody /> },
    { label: 'Tests', key: '4', children: <HttpTests /> },
    { label: 'Compare', key: '5', children: <HttpCompare /> },
    { label: 'Mock', key: '6', children: <HttpMock recordId={store.request.recordId} /> },
  ].filter((i) => !(i.key === '6' && !store.request.recordId));
  return (
    <div
      css={css`
        //相当于最小高度
        padding-left: 16px;
        padding-right: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .ant-tabs-content-holder {
          height: 100px;
        }
      `}
    >
      <Tabs
        style={{ height: '100%' }}
        activeKey={activeKey}
        items={items}
        onChange={(val) => {
          setActiveKey(val);
        }}
      ></Tabs>
    </div>
  );
};

export default HttpRequestOptions;
