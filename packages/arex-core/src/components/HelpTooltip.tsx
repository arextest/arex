import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React, { FC } from 'react';

export interface HelpTooltipProps {
  title: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
}

const HelpTooltip: FC<HelpTooltipProps> = (props) => (
  <>
    <Typography.Text>{props.children}</Typography.Text>
    <Tooltip
      title={props.title}
      placement='top'
      overlayStyle={{ maxWidth: props.maxWidth || '200px' }}
    >
      <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
    </Tooltip>
  </>
);

export default HelpTooltip;
