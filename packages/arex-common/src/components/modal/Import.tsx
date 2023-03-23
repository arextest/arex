import { css } from '@emotion/react';
import { Button, Modal, Tabs, TabsProps } from 'antd';
import React, { useState } from 'react';

import FileImport from './FileImport';

const ImportModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `File`,
      children: (
        <div>
          <FileImport></FileImport>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button size={'small'} onClick={showModal}>
        Import
      </Button>
      <Modal width={800} title='Import' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tabs items={items} />
      </Modal>
    </>
  );
};

export default ImportModal;
