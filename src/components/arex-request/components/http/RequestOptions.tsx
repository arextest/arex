// @ts-nocheck
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Tabs, TabsProps, Tag } from 'antd';
import { useContext, useState } from 'react';

import { httpProfile } from '../../config';
import ExtraRequestTabItemCompare from '../../extra/ExtraRequestTabItemCompare';
import ExtraRequestTabItemMock from '../../extra/ExtraRequestTabItemMock';
import { getValueByPath } from '../../helpers/utils/locale';
import { GlobalContext, HttpContext } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpTests from './Tests';

const ParamCount = styled<{ count: number }>((props) => <Tag {...props}>{props.count}</Tag>)`
  display: ${(props) => (props.count > 0 ? 'inline-block' : 'none')};
  border-radius: 6px;
  height: 18px;
  line-height: 16px;
  padding: 0 4px;
  margin-left: 4px;
`;

const HttpRequestOptions = ({ requestAxios }) => {
  const { store } = useContext(HttpContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);
  const [activeKey, setActiveKey] = useState('__body__');
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);

  const items: TabsProps['items'] = [
    {
      label: (
        <div>
          {t('tab.parameters')}
          <ParamCount count={store.request.params.length} />
        </div>
      ),
      key: '__parameters__',
      children: <HttpParameters />,
    },
    {
      label: (
        <div>
          {t('tab.headers')}
          <ParamCount count={store.request.headers.length} />
        </div>
      ),
      key: '__headers__',
      children: <HttpHeaders />,
    },
    { label: t('tab.body'), key: '__body__', children: <HttpBody /> },
    { label: t('tab.tests'), key: '__tests__', children: <HttpTests /> },
    {
      label: 'Compare',
      key: '__compare__',
      children: <ExtraRequestTabItemCompare requestAxios={requestAxios} />,
    },
    {
      label: 'Mock',
      key: '__mock__',
      children: (
        <ExtraRequestTabItemMock requestAxios={requestAxios} recordId={store.request.recordId} />
      ),
    },
    ...httpProfile.tabs.extra,
  ]
    .filter((i) => !(i.key === '__mock__' && !store.request.recordId))
    .filter(httpProfile.tabs.filter);
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
      />
    </div>
  );
};

export default HttpRequestOptions;
