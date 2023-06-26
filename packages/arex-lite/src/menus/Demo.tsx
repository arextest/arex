import { FileOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ArexMenuFC, createArexMenu, useTranslation } from '@arextest/arex-core';
import React from 'react';

import { MenusType, PanesType } from '../constant';

const Demo: ArexMenuFC = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <div>DemoMenu</div>
      <span>{t('are_you_sure', { ns: 'common' })}</span>
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
