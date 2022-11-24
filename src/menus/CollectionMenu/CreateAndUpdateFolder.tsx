import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { treeFindPath } from '../../helpers/collection/util';
import { CollectionService } from '../../services/CollectionService';
import { useStore } from '../../store';

const CreateAndUpdateFolder: React.FC<any> = ({
  updateDirectoryTreeData,
  collectionTree,
  collectionCreateAndUpdateModal,
}) => {
  const {
    userInfo: { email: userName },
  } = useStore();
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  const [CollectionCreateAndUpdateModalVisible, setCollectionCreateAndUpdateModalVisible] =
    useState(collectionCreateAndUpdateModal.collectionCreateAndUpdateModalVisible);
  const [CollectionCreateAndUpdateModalFolderName, setCollectionCreateAndUpdateModalFolderName] =
    useState(collectionCreateAndUpdateModal.collectionCreateAndUpdateModalFolderName);

  useEffect(() => {
    setCollectionCreateAndUpdateModalFolderName(
      collectionCreateAndUpdateModal.collectionCreateAndUpdateModalFolderName,
    );
    setCollectionCreateAndUpdateModalVisible(
      collectionCreateAndUpdateModal.collectionCreateAndUpdateModalVisible,
    );
  }, [collectionCreateAndUpdateModal]);

  const handleOk = () => {
    const paths = treeFindPath(
      collectionTree,
      (node) => node.key === collectionCreateAndUpdateModal.collectionCreateAndUpdateModalId,
    );
    CollectionService.rename({
      id: _useParams.workspaceId,
      newName: CollectionCreateAndUpdateModalFolderName,
      path: paths.map((i: any) => i.key),
      userName,
    }).then((res) => {
      setCollectionCreateAndUpdateModalVisible(false);
      setCollectionCreateAndUpdateModalFolderName('');
      updateDirectoryTreeData();
    });
  };

  const handleCancel = () => {
    setCollectionCreateAndUpdateModalVisible(false);
  };

  return (
    <Modal
      title={collectionCreateAndUpdateModal.collectionCreateAndUpdateModalMode}
      open={CollectionCreateAndUpdateModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Input
        value={CollectionCreateAndUpdateModalFolderName}
        onChange={(e) => {
          setCollectionCreateAndUpdateModalFolderName(e.target.value);
        }}
      />
    </Modal>
  );
};

export default CreateAndUpdateFolder;
