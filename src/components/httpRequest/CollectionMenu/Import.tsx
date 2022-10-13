import { Form, Input, Modal, notification, TreeSelect } from 'antd';
import React, { useState } from 'react';

import request from '../../../api/axios';
import { treeFindPath } from '../../../helpers/collection/util';

const CollectionImport = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <>
        <Modal
          visible={visible}
          title={`SAVE CASE - ${'title'}`}
          okText='Create'
          cancelText='Cancel'
          onCancel={() => setVisible(false)}
        ></Modal>
      </>
    </div>
  );
};

export default CollectionImport;
