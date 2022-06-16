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
    title: 'Default Target Host',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Access CI',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Start replay</a>
        <a>Lastest report</a>
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
const Replay = () => {
  const [count, setCount] = useState(0);
  return <div style={{fontStyle:'12px'}}>
    <Table columns={columns} dataSource={data} />
  </div>;
};

export default Replay;
