import { Tabs } from 'antd';

// import WorkspaceOverviewPage from '../WorkspaceOverviewPage';
import CollectionLabCustom from './CollectionLabCustom';

const WorkspaceOverview = () => {
  const item = [
    // {
    //   label: `Tab ${'id'}`,
    //   key: 'id',
    //   children: <WorkspaceOverviewPage />,
    // },
    {
      label: `Lab`,
      key: 'lab',
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
