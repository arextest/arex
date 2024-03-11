import { AutoComplete, Input, SelectProps, Space } from 'antd';
import React, { FC, useEffect } from 'react';

export type TargetUrlValue = {
  protocol?: string;
  host?: string;
};

export type TargetUrlInputProps = {
  options?: SelectProps['options'];
  value?: TargetUrlValue;
  onChange?: (value: TargetUrlValue) => void;
};

const TargetUrlInput: FC<TargetUrlInputProps> = (props) => {
  const [protocol, setProtocol] = React.useState(props.value?.protocol);
  const [host, setHost] = React.useState(props.value?.host);

  useEffect(() => {
    setProtocol(props.value?.protocol);
  }, [props.value?.protocol]);

  useEffect(() => {
    setHost(props.value?.host);
  }, [props.value?.host]);

  return (
    <Space.Compact style={{ width: '100%' }}>
      <AutoComplete
        value={protocol}
        options={props.options}
        onChange={(value) => {
          setProtocol(value);
          props.onChange?.({ protocol: value, host });
        }}
        style={{ width: '104px' }}
      />
      <Input
        allowClear
        value={host}
        onChange={(e) => {
          const value = e.target.value;
          setHost(value);
          props.onChange?.({ protocol, host: value });
        }}
        placeholder='<ip>:<port>'
      />
    </Space.Compact>
  );
};

export default TargetUrlInput;
