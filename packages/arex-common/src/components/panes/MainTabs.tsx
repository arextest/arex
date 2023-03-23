import { ExclamationCircleFilled } from '@ant-design/icons';
import { css } from '@emotion/react';
import { App, Select, theme } from 'antd';
import { FC } from 'react';

import DraggableTabs from '../DraggableTabs';

const { useToken } = theme;
interface MainTabsProps {
  items: { key: string; label: string; children: any }[];
  activeKey: string;
}
const MainTabs: FC<MainTabsProps> = ({ items, activeKey }) => {
  const { message, modal } = App.useApp();

  const removeTab = (targetKey: string) => {
    console.log(targetKey);
  };
  const addTab = () => {
    console.log();
  };
  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };
  const { token } = useToken();
  console.log(items, 'items');
  return (
    <div>
      <DraggableTabs
        activeKey={activeKey}
        onChange={(activePane) => {
          console.log(activePane);
        }}
        onEdit={handleTabsEdit}
        size='small'
        type='editable-card'
        tabBarGutter={-1}
        items={items}
      ></DraggableTabs>
    </div>
  );
};

export default MainTabs;
