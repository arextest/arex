import { FileOutlined } from '@ant-design/icons';
import { ArexMenuFC, createArexMenu, useTranslation } from '@arextest/arex-core';
import { Button, Space, Typography } from 'antd';
import React from 'react';

import { MenusType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';

const Demo: ArexMenuFC = (props) => {
  const navPane = useNavPane();

  return (
    <>
      <Typography.Title level={5}>DemoMenu</Typography.Title>
      <Space direction='vertical'>
        <Button
          onClick={() => {
            // props.onSelect: ArexMenu 组件打开默认绑定 pane 的方法
            props.onSelect?.('demoId', { name: 'Jack', age: 15 });
          }}
        >
          Open DemoPane
        </Button>
        <Button
          onClick={() =>
            //   自定义打开 pane 的方法
            navPane({
              id: 'components',
              type: PanesType.COMPONENTS,
            })
          }
        >
          Open ComponentPane
        </Button>
      </Space>
    </>
  );
};

export default createArexMenu(Demo, {
  type: MenusType.DEMO,
  paneType: PanesType.DEMO,
  icon: <FileOutlined />,
});
