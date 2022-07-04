import { Input, Modal } from "antd";
import React from "react";

import { FileSystemService } from "../../api/FileSystem.service";
import { useStore } from "../../store";
import { findPathByKey } from "./util";

const CreateAndUpdateFolder: React.FC<any> = ({ updateDirectorytreeData }) => {
  const collectionTree = useStore(state => state.collectionTree)
  const collectionCreateAndUpdateModalVisible = useStore(state => state.collectionCreateAndUpdateModalVisible)
  const collectionCreateAndUpdateModalFolderName = useStore(state => state.collectionCreateAndUpdateModalFolderName)
  const collectionCreateAndUpdateModalMode = useStore(state => state.collectionCreateAndUpdateModalMode)
  const collectionCreateAndUpdateModalId = useStore(state => state.collectionCreateAndUpdateModalId)
  const setCollectionCreateAndUpdateModalVisible = useStore(state => state.setCollectionCreateAndUpdateModalVisible)
  const setCollectionCreateAndUpdateModalFolderName = useStore(state => state.setCollectionCreateAndUpdateModalFolderName)
  const handleOk = () => {
    const paths = findPathByKey(collectionTree, collectionCreateAndUpdateModalId)
    FileSystemService.rename({
      id: '62b3fc610c4d613355bd2b5b',
      newName: collectionCreateAndUpdateModalFolderName,
      path: paths.map(i => i.key)
    }).then(res => {
      console.log(res)
      setCollectionCreateAndUpdateModalVisible(false)
      setCollectionCreateAndUpdateModalFolderName('')
      updateDirectorytreeData()
    })
  };

  const handleCancel = () => {
    setCollectionCreateAndUpdateModalVisible(false)
    // setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={collectionCreateAndUpdateModalMode}
        visible={collectionCreateAndUpdateModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={collectionCreateAndUpdateModalFolderName}
          onChange={(e) => {
            setCollectionCreateAndUpdateModalFolderName(e.target.value)
          }}
        />
      </Modal>
    </>
  );
};

export default CreateAndUpdateFolder;
