import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import { Badge, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FC, useState } from "react";

import { FileSystemService } from "../../api/FileSystem.service";
import { PlanStatistics } from "../../api/FileSystem.type";
import { useStore } from "../../store";
import { Theme } from "../../style/theme";

export const states = [
  { label: "init", color: "grey", value: 0 },
  { label: "running", color: "orange", value: 1 },
  { label: "done", color: "green", value: 2 },
  { label: "interrupted", color: "red", value: 3 },
  { label: "cancelled", color: "blue", value: 4 },
];

const columns: ColumnsType<PlanStatistics> = [
  {
    title: "Application",
    key: "appId",
    render: (_, record) => <a>{`${record.appId}_${record.appName}`}</a>,
  },
  {
    title: "Report Name",
    dataIndex: "planName",
  },
  {
    title: "State",
    render: (_, record) => {
      const state = states.find((s) => s.value === record.status);
      return state ? (
        <Tag color={state.color}>
          {state.label}
          {record.status === 1 && (
            <>
              <Badge status="processing" />
              {record.percent && (
                <span>{record.percent > 99 ? 99 : record.percent}</span>
              )}
            </>
          )}
        </Tag>
      ) : (
        <Tag>Unknown State</Tag>
      );
    },
  },
  {
    title: "Passed",
    dataIndex: "successCaseCount",
  },
  {
    title: "Failed",
    dataIndex: "failedCaseCount",
  },
  {
    title: "Invalid",
    dataIndex: "errorCaseCount",
  },
  {
    title: "Blocked",
    dataIndex: "waitCaseCount",
  },
  {
    title: "Action",
    dataIndex: "creator",
  },
  {
    title: "replayStartTime",
    dataIndex: "replayStartTime",
    render(text) {
      return text ? new Date(text).toLocaleString() : "";
    },
  },
];

const AppTable = styled(Table)<{ theme: Theme }>`
  // 被选中的表格行的样式
  .clickRowStyl {
    background-color: ${(props) =>
      props.theme === Theme.light ? "#f6efff" : "#171528"};
  }
  .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background-color: ${(props) =>
      props.theme === Theme.light ? "#f6efff88" : "#17152888"}!important;
  }
`;
const Results: FC<{ appId?: string }> = ({ appId }) => {
  const theme = useStore((state) => state.theme);
  const [selectRow, setSelectRow] = useState<number>();
  const { data: planStatistics } = useRequest(
    () =>
      FileSystemService.queryPlanStatistics({
        appId,
        needTotal: true,
        pageSize: 100,
        pageIndex: 1,
      }),
    {
      ready: !!appId,
      refreshDeps: [appId],
      onSuccess(res) {
        console.log(res);
      },
    }
  );
  return (
    <div>
      <AppTable
        bordered
        size="small"
        theme={theme}
        pagination={false}
        columns={columns}
        onRow={(record, index) => {
          return {
            onClick: (event) => {
              console.log(record, index);
              setSelectRow(index);
            },
          };
        }}
        rowClassName={(record, index) => {
          return index === selectRow ? "clickRowStyl" : "";
        }}
        dataSource={planStatistics}
      />
    </div>
  );
};

export default Results;
