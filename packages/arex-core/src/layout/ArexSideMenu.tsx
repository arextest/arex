import { css } from '@emotion/react';
import { Tabs, theme } from 'antd';
import { FC, useState } from 'react';

export interface AppSidenavProps {
  items: any[];
}

const ArexSideMenu: FC<AppSidenavProps> = ({ items }) => {
  const [activeKey, setActiveKey] = useState('Collection');
  const token = theme.useToken();
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          padding: 10px;
          border-bottom: 1px solid ${token.token.colorBorder};
          justify-content: space-between;
        `}
      >
        <span>arex</span>
      </div>
      <Tabs
        css={css`
          flex: 1;
          .ant-tabs-tabpane {
            padding-left: 12px !important;
          }
        `}
        tabPosition='left'
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          // console.log(key)
          //
        }}
        items={items}
      />
    </div>
  );
};

export default ArexSideMenu;
