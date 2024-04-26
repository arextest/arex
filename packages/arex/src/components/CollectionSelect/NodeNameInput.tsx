import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { SmallTextButton } from '@arextest/arex-core';
import { Input, Space } from 'antd';
import React, { useState } from 'react';

export type EditInputProps = {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
};

const NodeNameInput = (props: EditInputProps) => {
  const [nodeName, setNodeName] = useState(props.initialValue);
  return (
    <Space style={{ display: 'flex' }}>
      <Input
        value={nodeName}
        onPressEnter={() => props.onSave?.(nodeName)}
        onChange={(e) => setNodeName(e.currentTarget.value)}
        style={{ padding: '0 4px' }}
      />
      <SmallTextButton icon={<CloseOutlined />} onClick={props.onCancel} />
      <SmallTextButton icon={<CheckOutlined />} onClick={() => props.onSave?.(nodeName)} />
    </Space>
  );
};

export default NodeNameInput;
