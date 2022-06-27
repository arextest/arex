import { useRequest } from "ahooks";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React from "react";

import { FileSystemService } from "../api/FileSystem.service";

interface DataType {
  status: number;
  modifiedTime: string;
  appId: string;
  features: number;
  groupName: string;
  groupId: string;
  agentVersion: string;
  agentExtVersion: string;
  appName: string;
  description: string;
  category: string;
  owner: string;
  organizationName: string;
  recordedCaseCount: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Application",
    key: "appId",
    render: (_, record) => <a>{`${record.appId}_${record.appName}`}</a>,
  },
  {
    title: "Default Target Host",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Access CI",
    render: (_, record) => (
      <Tag>{(record.features & 1) === 1 ? "ON" : "OFF"}</Tag>
    ),
  },
  {
    title: "Case Count",
    dataIndex: "recordedCaseCount",
    key: "recordedCaseCount",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Start replay</a>
        <a>Lastest report</a>
      </Space>
    ),
  },
];

const Replay = () => {
  const { data } = useRequest(FileSystemService.regressionList, {
    onSuccess(res) {
      console.log(res);
    },
  });
  return (
    <Table
      bordered
      columns={columns}
      dataSource={data?.map((item) => item.application) || []}
      style={{ marginTop: "16px" }}
    />
  );
};

export default Replay;
