import { Drawer, theme } from 'antd';
import React, { FC, ReactNode } from 'react';

import DiffJsonView, { DiffJsonViewProps } from './index';

export interface DiffJsonViewDrawerProps extends DiffJsonViewProps {
  title?: ReactNode;
  open: boolean;
  onClose: () => void;
}

const DiffJsonViewDrawer: FC<DiffJsonViewDrawerProps> = ({
  title,
  open = false,
  onClose,
  ...diffJsonViewProps
}) => {
  const { token } = theme.useToken();
  return (
    <Drawer
      title={title}
      width={'75%'}
      footer={false}
      open={open}
      onClose={onClose}
      bodyStyle={{ padding: `${token.paddingSM}px ${token.padding}px` }}
    >
      <DiffJsonView height='85vh' {...diffJsonViewProps} />
    </Drawer>
  );
};

export default DiffJsonViewDrawer;
