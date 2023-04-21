import { FileOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { ArexPaneFC, createArexPane, decodeUrl } from 'arex-core';
import React, { useState } from 'react';

import { MenusType, PanesType } from '../constant';
import useNavPane from '../hooks/useNavPane';

const Demo: ArexPaneFC = (props) => {
  const paneNav = useNavPane();
  const [decode, setDecode] = useState<any>();

  return (
    <div>
      <div>DemoPane</div>

      <Space>
        <div>url encode/decode demo </div>

        <Button
          onClick={() => {
            paneNav(
              {
                workspaceId: '321',
                menuType: MenusType.ENVIRONMENT,
                paneType: PanesType.DEMO,
                id: '123',
              },
              { name: 'Tom', age: 10 },
            );
          }}
        >
          nav
        </Button>
        <Button
          onClick={() => {
            const decode = decodeUrl();
            setDecode(decode);
            console.log(decode);
          }}
        >
          decode url
        </Button>
      </Space>
      <div>{JSON.stringify(decode, null, 2)}</div>
    </div>
  );
};

export default createArexPane(Demo, {
  type: PanesType.DEMO,
  menuType: MenusType.DEMO,
  icon: <FileOutlined />,
});
