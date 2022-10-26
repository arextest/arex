import { Tabs } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpTests from './Tests';
import HttpParameters from './Parameters';
import { HttpContext } from '../../index';
import { getValueByPath } from '../../helpers/utils/locale';
import { css } from '@emotion/react';
const HttpRequestOptions = ({ data, requestExtraTabItems }) => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(store.locale, key);
  const [activeKey, setActiveKey] = useState('3');

  const items = [
    { label: t('request.parameters'), key: '0', children: <HttpParameters /> }, // 务必填写 key
    // { label: 'form-data', key: '1', children: '内容 2' },
    // { label: 'x-www-form-urlencoded', key: '2', children: '内容 2' },
    { label: 'Headers', key: '1', children: <HttpHeaders data={data} /> },
    { label: 'Body', key: '3', children: <HttpBody theme={store.theme.type} data={data} /> },
    { label: 'Tests', key: '4', children: <HttpTests theme={store.theme.type} data={data} /> },
    // { label: 'binary', key: '4', children: '内容 2' },
    ...requestExtraTabItems,
  ];
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
