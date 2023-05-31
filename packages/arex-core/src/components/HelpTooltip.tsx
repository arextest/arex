import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React, { FC } from 'react';

const HelpTooltip: FC<{ title: string; children: React.ReactNode }> = (props) => (
  <>
    <Typography.Text>{props.children}</Typography.Text>
    <Tooltip
      title={<Typography.Text>{props.title}</Typography.Text>}
      placement='top'
      overlayStyle={{ maxWidth: '200px' }}
    >
      <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
    </Tooltip>
  </>
);

export default HelpTooltip;
