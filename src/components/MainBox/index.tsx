import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import Header from '../Header';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('常规', 'normal', <PieChartOutlined />),
  getItem('对比', 'compare', <DesktopOutlined />),
  getItem('回放', 'replay', <ContainerOutlined />),
  getItem('设置', 'setting', <ContainerOutlined />),
];


const MainBox: React.FC = () => {
  const s = useNavigate()
  const onClick: MenuProps['onClick'] = e => {
    console.log('click', e);
    // useNavigate().push(e.key);

    s(`/${e.key}`)
  };

  return (
    <div>
      <Header></Header>
      <div style={{display:'flex'}}>
        <Menu onClick={onClick} style={{ width: 150 }} mode="vertical" items={items} />
        <div style={{flex:'1'}}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default MainBox;
