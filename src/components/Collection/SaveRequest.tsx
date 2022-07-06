import { Form, Input, Modal, TreeSelect } from "antd";
import { useState } from "react";

import { FileSystemService } from "../../api/FileSystem.service";
import { collectionOriginalTreeToAntdTreeSelectData } from "../../helpers/collection/util";
import { useStore } from "../../store";
import {findPathByKey} from "./util";

const { TreeNode } = TreeSelect;

const CollectionSaveRequest = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const collectionSaveRequest = useStore(state => state.collectionSaveRequest);
  const setCollectionSaveRequest = useStore(state => state.setCollectionSaveRequest);

  const collectionTree = useStore(state => state.collectionTree);

  const showModal = () => {
    // setIsModalVisible(true);
  };

  const handleOk = () => {
    setCollectionSaveRequest({
      ...collectionSaveRequest,
      isModalVisible: false
    });
  };

  const handleCancel = () => {
    setCollectionSaveRequest({
      ...collectionSaveRequest,
      isModalVisible: false
    });
  };

  const [value, setValue] = useState<string | undefined>(undefined);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  // const treeData = [
  //   {
  //     title: 'Node1',
  //     value: '0-0',
  //     children: [
  //       {
  //         title: 'Child Node1',
  //         value: '0-0-1',
  //       },
  //       {
  //         title: 'Child Node2',
  //         value: '0-0-2',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Node2',
  //     value: '0-1',
  //   },
  // ];
  return <div>
    <Modal title="SAVE REQUEST" visible={collectionSaveRequest.isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        layout="vertical"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={() => {
          console.log('1234')
          const paths = findPathByKey(collectionTree, value)
          // TODO: 新建保存需要两个接口，必须得先定义结构体，字段命名需要长一些cardtype
          FileSystemService.addItem({
            id: "62b3fc610c4d613355bd2b5b",
            nodeName: 'New Request',
            nodeType: 1,
            parentPath: paths.map(item=>item.key),
            userName: "zt",
          }).then(() => {
            console.log('12345')
            // updateDirectorytreeData()
          });

        }}
      >
        <Form.Item
          label="Request name"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={`Select Folder`}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={collectionOriginalTreeToAntdTreeSelectData(collectionTree)}
          >
          </TreeSelect>
        </Form.Item>

      </Form>

    </Modal>
  </div>
}

export default CollectionSaveRequest
