import { Modal } from 'antd';
import React, { useState } from 'react';

const CollectionImport = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Modal
      open={open}
      title={`SAVE CASE - ${'title'}`}
      okText='Create'
      cancelText='Cancel'
      onCancel={() => setOpen(false)}
    />
  );
};

export default CollectionImport;
