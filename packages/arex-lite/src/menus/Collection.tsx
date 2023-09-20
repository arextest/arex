import { ApiOutlined } from '@ant-design/icons';
import { ArexMenuFC, createArexMenu } from '@arextest/arex-core';
import { Button } from 'antd';
import React from 'react';

import { MenusType, PanesType } from '@/constant';
import { requestCollection } from '@/mocks/requestCollection';

const Collection: ArexMenuFC = (props) => {
  return (
    <div style={{ padding: '8px' }}>
      {/*{selectedKey}*/}
      {requestCollection.map((r) => {
        return (
          <Button
            size={'small'}
            key={r.id}
            onClick={() => {
              props.onSelect?.(r.id);
            }}
          >
            {r.title}
          </Button>
        );
      })}
    </div>
  );
};

export default createArexMenu(Collection, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
