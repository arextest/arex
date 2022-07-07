import "chart.js/auto";

import { css } from "@emotion/react";
import { useRequest } from "ahooks";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { FC, useMemo } from "react";
import { Pie } from "react-chartjs-2";

import { FileSystemService } from "../../api/FileSystem.service";
import { PlanItemStatistics, PlanStatistics } from "../../api/FileSystem.type";
import { Color } from "../../style/theme";
import { getPercent } from "../../utils";
import { states } from "./Results";

const { Text } = Typography;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "left",
    },
  },
} as const;

const columns: ColumnsType<PlanItemStatistics> = [
  { title: "Plan Item ID", dataIndex: "planItemId", key: "planItemId" },
  { title: "API", dataIndex: "operationName", key: "operationName" },
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
    title: "Time consumed(s)",
    render: (_, record) =>
      (record.replayEndTime -
        (record.replayStartTime || record.replayEndTime)) /
      1000,
  },
  {
    title: "Total Cases",
    dataIndex: "totalCaseCount",
  },
  {
    title: "Passed",
    dataIndex: "successCaseCount",
    render: (text) => <Text type="success">{text}</Text>,
  },
  {
    title: "Failed",
    dataIndex: "failCaseCount",
    render: (text) => <Text type="danger">{text}</Text>,
  },
  {
    title: "Invalid",
    dataIndex: "errorCaseCount",
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: "Blocked",
    dataIndex: "waitCaseCount",
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: "Action",
    render: (_, record) => [
      <Button type="text" size="small" style={{ color: Color.primaryColor }}>
        Result
      </Button>,
      <Button type="text" size="small" danger>
        Rerun
      </Button>,
    ],
  },
];

const Report: FC<{ selectedPlan?: PlanStatistics }> = ({ selectedPlan }) => {
  const { data: planItemData } = useRequest(
    () =>
      FileSystemService.queryPlanItemStatistics({
        planId: selectedPlan!.planId,
      }),
    {
      ready: !!selectedPlan?.planId,
      refreshDeps: [selectedPlan?.planId],
      onSuccess(res) {
        console.log(res);
      },
    }
  );
  const countData = [
    selectedPlan?.successCaseCount,
    selectedPlan?.failCaseCount,
    selectedPlan?.errorCaseCount,
    selectedPlan?.waitCaseCount,
  ];
  const countSum = useMemo(
    () => countData.reduce((a, b) => (a || 0) + (b || 0), 0),
    [countData]
  );
  return selectedPlan ? (
    <Card size="small" title={"Report: " + selectedPlan.planName}>
      <Row gutter={12}>
        <Col span={12}>
          <b style={{ color: "gray" }}>Basic Information</b>
          <div
            css={css`
              display: flex;
              & > * {
                flex: 1;
              }
            `}
          >
            <Statistic
              title="Pass Rate"
              value={getPercent(
                selectedPlan.successCaseCount,
                selectedPlan.totalCaseCount
              )}
            />
            <Statistic
              title="API Pass Rate"
              value={getPercent(
                selectedPlan.successOperationCount,
                selectedPlan.totalOperationCount
              )}
            />
          </div>

          <div>Report Name: {selectedPlan.planName}</div>
          <div>Target Host: {selectedPlan.targetHost}</div>
          <div>Executor: {selectedPlan.creator}</div>
          <span>Record version: {selectedPlan.caseRecordVersion}</span>
          <span>Replay version: {selectedPlan.coreVersion}</span>
        </Col>

        <Col span={12}>
          <b style={{ color: "gray" }}>Replay Pass Rate</b>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ height: "160px", width: "100%", padding: "16px 0" }}>
              <Pie
                data={{
                  labels: ["Passed", "Failed", "Invalid", "Blocked"],
                  datasets: [
                    {
                      data: countData,
                      backgroundColor: [
                        "#91cc75",
                        "#ef6566",
                        "#73c0de",
                        "#fac858",
                      ],
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                width: "160px",
                padding: "16px 16px 16px 0",
              }}
            >
              <div>Total Cases: {countSum}</div>
              <div>Passed: {countData[0]}</div>
              <div>Failed: {countData[1]}</div>
              <div>Blocked: {countData[2]}</div>
              <div>Invalid: {countData[3]}</div>
            </div>
          </div>
        </Col>
      </Row>

      <br />

      <Table size="small" columns={columns} dataSource={planItemData} />
    </Card>
  ) : (
    <></>
  );
};

export default Report;
