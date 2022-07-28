import { useMount } from 'ahooks';
import { Input, Select, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';

import HttpRequest from '../components/Http/index';
import { treeFindPath } from '../helpers/collection/util';
const { TabPane } = Tabs;
const { Text, Link } = Typography;

const FolderPage = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div>
      <Tabs defaultActiveKey='1' onChange={onChange}>
        <TabPane tab='Authorization' key='1'>
          <div style={{ marginBottom: '20px' }}>
            <Text>
              This authorization method will be used for every request in this folder. You can
              override this by specifying one in the request.
            </Text>
          </div>

          <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '200px', display: 'inline-block' }}>
                <Text strong>Type</Text>
              </div>
              <Select
                style={{ width: '200px' }}
                options={[
                  {
                    value: 'parent',
                    label: 'Inherit auth from parent',
                  },
                ]}
                disabled
                value={'parent'}
              />
            </div>
            <Text type='secondary'>
              The authorization header will be automatically generated when you send the request.
            </Text>
          </div>
        </TabPane>
        <TabPane tab='Pre-request Script' key='2' disabled>
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab='Tests' key='3' disabled>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FolderPage;
