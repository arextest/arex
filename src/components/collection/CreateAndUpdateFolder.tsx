import { Input, Modal } from "antd";
import React, { useState, useEffect } from "react";

import { CollectionService } from "../../services/CollectionService";
import { treeFindPath } from "../../helpers/collection/util";
// import { findPathByKey } from "../../helpers/collection/util";

const CreateAndUpdateFolder: React.FC<any> = (
  { updateDirectorytreeData, collectionTree, collectionCreateAndUpdateModal },
) => {
  const [
    CollectionCreateAndUpdateModalVisible,
    setCollectionCreateAndUpdateModalVisible,
  ] = useState(
    collectionCreateAndUpdateModal.collectionCreateAndUpdateModalVisible,
  );
  const [
    CollectionCreateAndUpdateModalFolderName,
    setCollectionCreateAndUpdateModalFolderName,
  ] = useState(
    collectionCreateAndUpdateModal.collectionCreateAndUpdateModalFolderName,
  );

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
      node=>node.key === collectionCreateAndUpdateModal.collectionCreateAndUpdateModalId,
    );
    CollectionService.rename({
      id: "62b3fc610c4d613355bd2b5b",
      newName: CollectionCreateAndUpdateModalFolderName,
      path: paths.map((i: any) => i.key),
    }).then((res) => {
      setCollectionCreateAndUpdateModalVisible(false);
      setCollectionCreateAndUpdateModalFolderName("");
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
