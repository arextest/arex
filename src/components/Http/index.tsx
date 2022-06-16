import {
  Button,
  Dropdown,
  Input,
  Menu,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import { FC, useState } from "react";
import {
  CheckOutlined,
  CodeOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";
import { ColumnsType } from "antd/es/table";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";

const { TabPane } = Tabs;

const RequestTypeOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
];

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group {
    margin-left: 16px;
  }
`;

const Http: FC = () => {
  const [requestType, setRequestType] = useState("GET");
  const [requestSavedName, setRequestSavedName] = useState("Untitled request");

  const dataSource = [
    {
      key: "1",
      value: 32,
    },
    {
      key: "2",
      value: 42,
    },
  ];

  const FormHeader = () => (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        position: relative;
        top: -8px;
      `}
    >
      <span
        css={css`
          font-size: 13px;
          line-height: 32px;
          font-weight: 500;
          color: #9d9d9d;
        `}
      >
        查询参数
      </span>
      <div>
        <Tooltip title="帮助">
          <Button type="text" icon={<QuestionCircleOutlined />} />
        </Tooltip>

        <Tooltip title="全部清除">
          <Button type="text" icon={<DeleteOutlined />} />
        </Tooltip>

        <Tooltip title="批量编辑">
          <Button type="text" icon={<EditOutlined />} />
        </Tooltip>

        <Tooltip title="新增">
          <Button type="text" icon={<PlusOutlined />} />
        </Tooltip>
      </div>
    </div>
  );

  const columns: ColumnsType<{
    key: string;
    value: number;
  }> = [
    {
      title: "参数",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "值",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      align: "center",
      render: (text, record) => (
        <Space>
          <Button type="text" icon={<CheckOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeaderWrapper>
        <Select
          value={requestType}
          options={RequestTypeOptions}
          onChange={setRequestType}
        />
        <Input style={{ width: "100%" }} />
        <Dropdown.Button
          type="primary"
          icon={<DownOutlined />}
          overlay={
            <Menu
              items={[
                {
                  key: "1",
                  label: "导入URL",
                  icon: <LinkOutlined />,
                },
                {
                  key: "2",
                  label: "显示代码",
                  icon: <CodeOutlined />,
                },
                {
                  key: "3",
                  label: "全部清除",
                  icon: <DeleteOutlined />,
                },
              ]}
            />
          }
        >
          发送
        </Dropdown.Button>

        <Dropdown.Button
          icon={<DownOutlined />}
          overlay={
            <Menu
              items={[
                {
                  key: "0",
                  label: (
                    <Input
                      value={requestSavedName}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setRequestSavedName(e.target.value)}
                    />
                  ),
                },
                {
                  key: "1",
                  label: "复制链接",
                  icon: <CopyOutlined />,
                },
                {
                  key: "2",
                  label: "View my links",
                  icon: <LinkOutlined />,
                },
                {
                  key: "3",
                  label: "另存为",
                  icon: <SaveOutlined />,
                },
              ]}
            />
          }
        >
          保存
        </Dropdown.Button>
      </HeaderWrapper>

      <Tabs defaultActiveKey="0">
        <TabPane tab="参数" key="0">
          <FormHeader />
          <Table
            bordered
            size="small"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
          />
        </TabPane>
        <TabPane tab="请求体" key="1">
          <CodeMirror
            value=""
            extensions={[json()]}
            height="300px"
            onChange={(value) => {}}
          />
        </TabPane>
        <TabPane tab="请求头" key="2">
          <FormHeader />
          <Table
            bordered
            size="small"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
          />
        </TabPane>
        <TabPane tab="授权" key="3">
          <CodeMirror
            value=""
            extensions={[json()]}
            height="300px"
            onChange={(value) => {}}
          />
        </TabPane>
        <TabPane tab="预请求脚本" key="4">
          <CodeMirror
            value=""
            height="300px"
            extensions={[javascript()]}
            onChange={(value) => {}}
          />
        </TabPane>
        <TabPane tab="测试" key="5">
          <CodeMirror
            value=""
            height="300px"
            extensions={[javascript()]}
            onChange={(value) => {}}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Http;
