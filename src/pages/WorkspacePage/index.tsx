import { Tabs } from 'antd';

import CollectionLabCustom from './CollectionLabCustom';
import WorkspaceSetting from './Setting';

const WorkspaceOverview = () => {
  const item = [
    {
      label: 'Overview',
      key: 'overview',
      children: <WorkspaceSetting />,
    },
    {
      label: 'Labels',
      key: 'labels',
      children: <CollectionLabCustom />,
    },
  ];
  return (
    <div>
      <Tabs tabPosition={'left'} items={item} />
    </div>
  );
};

export default WorkspaceOverview;
