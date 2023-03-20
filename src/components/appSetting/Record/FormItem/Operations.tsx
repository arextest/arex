import { List, Switch, Typography } from 'antd';
import React, { FC } from 'react';

import { FormItemProps } from './index';

export type OperationsProps = {
  dataSource: string[];
} & FormItemProps<string[]>;

const Operations: FC<OperationsProps> = (props) => {
  return (
    <>
      <List
        size='small'
        dataSource={props.dataSource}
        renderItem={(item) => (
          <List.Item>
            <Typography>{item}</Typography>
            <Switch
              size='small'
              checked={props.value?.includes(item)}
              onChange={(checked) => {
                let cloneValue = props.value ? [...props.value] : [];
                checked
                  ? cloneValue.push(item)
                  : (cloneValue = cloneValue.filter((value) => value !== item));
                return props.onChange?.(cloneValue);
              }}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Operations;
