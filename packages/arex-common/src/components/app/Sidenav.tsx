import { css } from '@emotion/react';
import { Button, Tabs, TabsProps, theme } from 'antd';
import { FC, useContext, useState } from 'react';

// import { useNavigate, useParams } from 'react-router-dom';
// import { MenuTypeEnum, PageTypeEnum } from '../../constant';
// import { useCustomNavigate } from '../../router/useCustomRouter';
// import { MainContext } from '../../store/content/MainContent';
// import CollectionMenu from '../menus/CollectionMenu';
// import EnvironmentMenu from '../menus/EnvironmentMenu';
import ImportModal from '../modal/Import';
const { useToken } = theme;
interface AppSidenavProps {
  items: any[];
}
const AppSidenav: FC<AppSidenavProps> = ({ items }) => {
  // const params = useParams();
  // const nav = useNavigate();
  // const customNavigate = useCustomNavigate();
  // const { dispatch, store } = useContext(MainContext);
  const [activeKey, setActiveKey] = useState('Collection');
  const token = useToken();
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

        <ImportModal></ImportModal>
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
      ></Tabs>
    </div>
  );
};

export default AppSidenav;
