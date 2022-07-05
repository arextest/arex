import { Table } from "antd";
import { FC } from "react";

const columns = [
  {
    title: "Application",
    key: "appId",
    render: (_, record) => <a>{`${record.appId}_${record.appName}`}</a>,
  },
  {
    title: "Report Name",
    dataIndex: "planName",
    key: "planName",
  },
  {
    title: "State",
  },
];
const Results: FC<{}> = () => {
  return (
    <div>
      <Table columns={columns} />
    </div>
  );
};

export default Results;
