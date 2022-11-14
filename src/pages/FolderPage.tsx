import { Tabs } from 'antd';

import { Authorization, PreRequestScript } from '../components/Folder';
import { PageFC } from './index';

const FolderPage: PageFC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey='authorization'
        items={[
          {
            key: 'authorization',
            label: 'Authorization',
            children: <Authorization />,
          },
          {
            key: 'pre-requestScript',
            label: 'Pre-request Script',
            children: <PreRequestScript />,
          },
          {
            key: 'tests',
            label: 'Tests',
            children: 'Content of Tests',
            disabled: true,
          },
        ]}
        onChange={onChange}
      />
    </div>
  );
};

export default FolderPage;
