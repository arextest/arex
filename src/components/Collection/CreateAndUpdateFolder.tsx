import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { treeFindPath } from '../../helpers/collection/util';
import { CollectionService } from '../../services/CollectionService';

const CreateAndUpdateFolder: React.FC<any> = ({
  updateDirectorytreeData,
  collectionTree,
  collectionCreateAndUpdateModal,
}) => {
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
    }).then((res) => {
      setCollectionCreateAndUpdateModalVisible(false);
      setCollectionCreateAndUpdateModalFolderName('');
      updateDirectorytreeData();
    });
  };

  const handleCancel = () => {
    setCollectionCreateAndUpdateModalVisible(false);
  };

  return (
    <>
      <Modal
        title={collectionCreateAndUpdateModal.collectionCreateAndUpdateModalMode}
        visible={CollectionCreateAndUpdateModalVisible}
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
    </>
  );
};

export default CreateAndUpdateFolder;
