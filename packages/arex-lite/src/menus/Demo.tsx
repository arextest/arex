import { FileOutlined } from '@ant-design/icons';
import { ArexMenuFC, createArexMenu, useTranslation } from '@arextest/arex-core';
import { Button } from 'antd';
import React from 'react';

import { MenusType, PanesType } from '@/constant';

const Demo: ArexMenuFC = (props) => {
  const { t } = useTranslation();

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
