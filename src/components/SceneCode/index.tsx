import { Tag } from 'antd';
import React, { FC } from 'react';

import { ReplayStatusCode } from '../../constant';

export const SceneCodeMap: {
  [key in ReplayStatusCode]: {
    color: string;
    message: string;
  };
} = {
  [ReplayStatusCode.EXCEPTION]: {
    color: 'red',
    message: 'exception',
  },
  [ReplayStatusCode.SUCCESS]: {
    color: 'green',
    message: 'success',
  },
  [ReplayStatusCode.VALUE_DIFF]: { color: 'magenta', message: 'value diff' },
  [ReplayStatusCode.LEFT_CALL_MISSING]: { color: 'orange', message: 'new call' },
  [ReplayStatusCode.RIGHT_CALL_MISSING]: { color: 'blue', message: 'call missing' },
};

const SceneCode: FC<{ code?: ReplayStatusCode }> = (props) =>
  props.code ? (
    <Tag color={SceneCodeMap[props.code].color}>{SceneCodeMap[props.code].message}</Tag>
  ) : null;

export default SceneCode;
