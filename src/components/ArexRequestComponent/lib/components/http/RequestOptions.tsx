import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { useContext, useState } from 'react';

import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpTests from './Tests';
import ExtraRequestTabItemCompare from '../../../extra/ExtraRequestTabItemCompare';
import ExtraRequestTabItemMock from '../../../extra/ExtraRequestTabItemMock';
const HttpRequestOptions = () => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);
  const [activeKey, setActiveKey] = useState('3');
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);

  const items = [
    { label: t('tab.parameters'), key: '0', children: <HttpParameters /> }, // 务必填写 key
    // { label: 'form-data', key: '1', children: '内容 2' },
    // { label: 'x-www-form-urlencoded', key: '2', children: '内容 2' },
    { label: t('tab.headers'), key: '1', children: <HttpHeaders /> },
    { label: t('tab.body'), key: '3', children: <HttpBody /> },
    { label: t('tab.tests'), key: '4', children: <HttpTests /> },
    { label: 'Compare', key: '5', children: <ExtraRequestTabItemCompare /> },
    {
      label: 'Mock',
      key: '6',
      children: <ExtraRequestTabItemMock recordId={store.request.recordId} />,
    },
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
