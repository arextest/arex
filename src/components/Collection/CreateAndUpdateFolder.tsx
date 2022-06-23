import { Button, Input, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import { FileSystemService } from "../../api/FileSystem.service";

const CreateAndUpdateFolder: React.FC<{updateParentComponent:any}> = ({ updateParentComponent }:any, ref) => {
  const [folderName, setFolderName] = useState("");
  const [currOpePath, setCurrOpePath] = useState([]);
  const [mode, setMode] = useState("create");
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: (newVal:any) => {
      setMode(newVal.mode);
      setCurrOpePath(newVal.path);
      showModal();
    },
  }));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log(folderName, "folderName");
    if (mode === "create") {
      FileSystemService.addItem({
        id: "62b3fc610c4d613355bd2b5b",
        nodeName: folderName,
        nodeType: 3,
        parentPath: currOpePath,
        userName: "zt",
      }).then(() => {
        setIsModalVisible(false);
        updateParentComponent();
      });
    } else if (mode === "update") {
      FileSystemService.rename({
        id: "62b3fc610c4d613355bd2b5b",
        path: currOpePath,
        newName: folderName,
      }).then(() => {
        setIsModalVisible(false);
        updateParentComponent();
      });
    } else if (mode === "createRequest") {
      FileSystemService.addItem({
        id: "62b3fc610c4d613355bd2b5b",
        nodeName: folderName,
        nodeType: 1,
        parentPath: currOpePath,
        userName: "zt",
      }).then(() => {
        setIsModalVisible(false);
        updateParentComponent();
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={mode}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
          }}
        />
      </Modal>
    </>
  );
};

export default forwardRef(CreateAndUpdateFolder);
