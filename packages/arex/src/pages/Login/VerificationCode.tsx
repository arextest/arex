import { LockOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { ChangeEventHandler, FC } from 'react';

const VerificationCode: FC<{
  value?: string;
  count?: number;
  onSendCode?: () => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = (props) => {
  return (
    <div style={{ display: 'flex' }}>
      <Input
        allowClear
        size='large'
        placeholder='Please enter a verification code'
        prefix={<LockOutlined />}
        onChange={props.onChange}
        style={{ flex: 1, marginRight: '8px' }}
      />
      <Button
        size='large'
        disabled={!!props.count}
        onClick={props.onSendCode}
        style={{ width: '120px' }}
      >
        {props.count ? props.count + 's' : 'Send code'}
      </Button>
    </div>
  );
};

export default VerificationCode;
