import { ApiOutlined } from '@ant-design/icons';
import { ArexMenuFC, createArexMenu } from '@arextest/arex-core';
import { Button, Space } from 'antd';
import React from 'react';

import { MenusType, PanesType } from '@/constant';
import { requestCollection } from '@/mocks/requestCollection';

const Collection: ArexMenuFC = (props) => {
  return (
    <Space direction='vertical' style={{ padding: '8px' }}>
      {requestCollection.map((r) => {
        return (
          <Button
            size={'small'}
            key={r.id}
            onClick={() => {
              props.onSelect?.(r.id);
            }}
          >
            {r.name}
          </Button>
        );
      })}
    </Space>
  );
};

export default createArexMenu(Collection, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
