import { FileOutlined } from '@ant-design/icons';
import { createMenu, MenusType } from 'arex-core';
import { ArexMenuFC, MenusManager } from 'arex-core';
import React from 'react';

const Demo: ArexMenuFC = (props) => {
  return (
    <>
      <div>DemoMenu</div>
      <div>
        <button onClick={() => props.onSelect?.('demoId')}>open pane</button>
      </div>
    </>
  );
};

export default createMenu(
  Demo,
  // TODO MenusType module 被重新 declare, 但是这里的 MenusType.DEMO 依然是 undefined
  // 尝试通过 MenusManager 动态创建带类型的 MenusType 未果
  // MenusType.DEMO,
  'Demo',
  <FileOutlined />,
);
