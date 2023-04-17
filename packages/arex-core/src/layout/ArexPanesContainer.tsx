import { TabsProps } from 'antd';
import React, { FC } from 'react';

import DraggableTabs from '../components/DraggableTabs';

interface MainTabsProps {
  items: TabsProps['items'];
  activeKey?: string;
  onAdd?: () => void;
  onRemove?: (key: string) => void;
}
const ArexPanesContainer: FC<MainTabsProps> = (props) => {
  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    props.onRemove?.(targetKey as string);
  };

  const handleTabsEdit: TabsProps['onEdit'] = (targetKey, action) => {
    action === 'add' ? props.onAdd?.() : removeTab(targetKey);
  };

  return (
    <DraggableTabs
      size='small'
      type='editable-card'
      tabBarGutter={-1}
      items={props.items}
      activeKey={props.activeKey}
      onEdit={handleTabsEdit}
    />
  );
};

export default ArexPanesContainer;
