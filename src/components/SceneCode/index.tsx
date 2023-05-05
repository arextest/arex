import { Tag } from 'antd';
import React, { FC } from 'react';

export const SceneCodeMap: {
  [key: string]: {
    color: string;
    message: string;
  };
} = {
  '-1': {
    color: 'red',
    message: 'exception',
  },
  '0': {
    color: 'green',
    message: 'success',
  },
  '1': { color: 'magenta', message: 'value diff' },
  '2': { color: 'orange', message: 'new call' },
  '4': { color: 'blue', message: 'call missing' },
};

const SceneCode: FC<{ code?: React.Key }> = (props) =>
  props.code ? (
    <Tag color={SceneCodeMap[props.code.toString()].color}>
      {SceneCodeMap[props.code.toString()].message}
    </Tag>
  ) : null;

export default SceneCode;
