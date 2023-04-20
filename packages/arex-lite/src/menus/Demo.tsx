import { FileOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { createArexMenu } from 'arex-core';
import { ArexMenuFC } from 'arex-core';
import React from 'react';

import { MenusType, PanesType } from '../constant';

const Demo: ArexMenuFC = (props) => {
  return (
    <>
      <div>DemoMenu</div>
      <div>
        <Button onClick={() => props.onSelect?.('demoId')}>open pane</Button>
      </div>
    </>
  );
};

export default createArexMenu(Demo, {
  type: MenusType.DEMO,
  paneType: PanesType.DEMO,
  icon: <FileOutlined />,
});
