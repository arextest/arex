import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

const HelpTooltip: FC<{ title: string }> = (props) => (
  <Tooltip title={props.title}>
    <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
  </Tooltip>
);

export default HelpTooltip;
