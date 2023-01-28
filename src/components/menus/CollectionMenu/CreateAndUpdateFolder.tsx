import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EmailKey } from '../../../constant';
import { treeFindPath } from '../../../helpers/collection/util';
import { getLocalStorage } from '../../../helpers/utils';
import { CollectionService } from '../../../services/Collection.service';

const CreateAndUpdateFolder: React.FC<any> = ({
  updateDirectoryTreeData,
  collectionTree,
  collectionCreateAndUpdateModal,
}) => {
  const userName = getLocalStorage<string>(EmailKey);
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
      (node: any) => node.key === collectionCreateAndUpdateModal.collectionCreateAndUpdateModalId,
    );
    CollectionService.rename({
      id: _useParams.workspaceId,
      newName: CollectionCreateAndUpdateModalFolderName,
      path: paths.map((i: any) => i.key),
      userName,
    }).then(() => {
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
