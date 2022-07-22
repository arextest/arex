import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  TreeSelect,
  Typography,
} from "antd";
import React, { useMemo, useState } from "react";
// import { findPathByKey } from "./util";
import { CollectionService } from "../../services/CollectionService";
import { useParams } from "react-router-dom";
import { FileSystemService } from "../../api/FileSystem.service";
import { treeFindPath } from "../../helpers/collection/util";
const { Text, Link } = Typography;
const treeData = [
  {
    title: "Node1",
    value: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-1",
      },
      {
        title: "Child Node2",
        value: "0-0-2",
      },
    ],
  },
  {
    title: "Node2",
    value: "0-1",
  },
];

const CollectionSaveRequest = (
  { show, onCreate, onCancel, collectionTreeData, activateNewRequestInPane, reqParams },
) => {
  const _useParams = useParams();
  const [form] = Form.useForm();
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  // 深度优先遍历
  const mapTree = (tree) => {
    const haveChildren =
      Array.isArray(tree.children) && tree.children.length > 0;
    // console.log(tree, "rrr");
    return {
      ...tree,
      disabled: tree.nodeType !== 3,
      children: haveChildren ? tree.children.map((i) => mapTree(i)) : [],
    };
  };

  const collectionTreeSelectData = useMemo(() => {
    return mapTree({ children: collectionTreeData })["children"];
  }, [collectionTreeData]);

  return (
    <Modal
      visible={show}
      title="SAVE REQUEST"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            console.log(values);
            CollectionService.addItem({
              id: _useParams.workspaceId,
              nodeName: values.requestName,
              nodeType: 1,
              parentPath: treeFindPath(
                collectionTreeData,
                (node) => node.key === value,
              )?.map((i) => i.key),
              userName: "zt",
            }).then((res) => {
              FileSystemService.saveInterface({
                ...reqParams,
                id: res.data.body.infoId,
              })
                .then((r) => {
                  // 通知父组件
                  activateNewRequestInPane({
                    key: res.data.body.infoId,
                    title: values.requestName,
                  });
                });
            });
            // onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="requestName"
          label="Request name"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/*<p>Save to          {findPathByKey(collectionTreeData, value)?.map((i) => i.title).join(' / ')}</p>*/}
        <p>
          Save to
          <Text type="secondary">
            {JSON.stringify(
              treeFindPath(collectionTreeData, (node) => node.key === value),
            )}
            {treeFindPath(collectionTreeData, (node) => node.key === value)
              ?.map((i) => i.title)
              .join(" / ")}
          </Text>
        </p>
        <Form.Item
          name="savePath"
          label=""
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <TreeSelect
            fieldNames={{ label: "title", value: "key" }}
            style={{ width: "100%" }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={collectionTreeSelectData}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CollectionSaveRequest;
