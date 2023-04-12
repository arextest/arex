import React, { FC } from 'react';

import DraggableTabs from '../components/DraggableTabs';

interface MainTabsProps {
  items: { key: string; label: string; children: any }[];
  activeKey: string;
}
const ArexPanesContainer: FC<MainTabsProps> = ({ items, activeKey }) => {
  const removeTab = (targetKey: string) => {
    console.log(targetKey);
  };
  const addTab = () => {
    console.log();
  };
  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  return (
    <DraggableTabs
      size='small'
      type='editable-card'
      tabBarGutter={-1}
      items={items}
      activeKey={activeKey}
      onEdit={handleTabsEdit}
    />
  );
};

export default ArexPanesContainer;
