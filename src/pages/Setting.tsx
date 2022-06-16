import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, {useState} from 'react';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Application',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Recordable',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Replayable',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Access CI',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Configuration Items',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Import(*.yaml)</a>
        <a>Record</a>
        <a>Replay</a>
        <a>Diff</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'spring-demo_unknown app name',
    age: 32,
    address: 'OFF',
    tags: ['0'],
  },
  {
    key: '1',
    name: 'spring-demo_unknown app name',
    age: 32,
    address: 'OFF',
    tags: ['0'],
  },
  {
    key: '1',
    name: 'spring-demo_unknown app name',
    age: 32,
    address: 'OFF',
    tags: ['0'],
  },
  {
    key: '1',
    name: 'spring-demo_unknown app name',
    age: 32,
    address: 'OFF',
    tags: ['0'],
  },
  {
    key: '1',
    name: 'spring-demo_unknown app name',
    age: 32,
    address: 'OFF',
    tags: ['0'],
  },
];
const Setting = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <Table columns={columns} dataSource={data} />
  </div>;
};

export default Setting;
