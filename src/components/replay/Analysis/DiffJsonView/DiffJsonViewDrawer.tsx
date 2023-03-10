import { Drawer } from 'antd';
import { FC } from 'react';

import DiffJsonView, { DiffJsonViewProps } from './index';

export interface DiffJsonViewDrawerProps extends DiffJsonViewProps {
  open: boolean;

  onClose: () => void;
}

const DiffJsonViewDrawer: FC<DiffJsonViewDrawerProps> = ({ data, open = false, onClose }) => {
  return (
    <Drawer width={'75%'} footer={false} open={open} style={{ top: 0 }} onClose={onClose}>
      <DiffJsonView data={data} />
    </Drawer>
  );
};

export default DiffJsonViewDrawer;
