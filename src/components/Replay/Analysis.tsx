import { css } from "@emotion/react";
import { useRequest } from "ahooks";
import { Button, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FC, useState } from "react";

import ReplayService from "../../api/Replay.service";
import { CategoryStatistic, Difference } from "../../api/Replay.type";
import { Color } from "../../style/theme";
import { MenuSelect } from "../index";

const categoryColumns: ColumnsType<Difference> = [
  {
    title: "Point of difference",
    dataIndex: "differenceName",
  },
  {
    title: "Scene Count",
    dataIndex: "sceneCount",
  },
  {
    title: "Case Count",
    dataIndex: "caseCount",
  },
  {
    title: "Action",
    render: (_, record) => (
      <Button type="text" size="small" style={{ color: Color.primaryColor }}>
        Scenes
      </Button>
    ),
  },
];

const Analysis: FC<{ planItemId: number }> = ({ planItemId }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryStatistic>();
  const { data: differenceData = [] } = useRequest(
    () =>
      ReplayService.queryDifferences({
        categoryName: selectedCategory!.categoryName,
        operationName: selectedCategory!.operationName,
        planItemId,
      }),
    {
      ready: !!selectedCategory,
      refreshDeps: [selectedCategory],
    }
  );
  return (
    <Row style={{ padding: "0 8px" }} gutter={8}>
      <Col span={6}>
        <MenuSelect<CategoryStatistic>
          defaultSelectFirst
          rowKey="operationName"
          onSelect={setSelectedCategory}
          placeholder="applicationsMenu.appFilterPlaceholder"
          request={() =>
            ReplayService.queryResponseTypeStatistic({ planItemId })
          }
          filter={(keyword: string, app: CategoryStatistic) =>
            app.operationName.includes(keyword)
          }
          itemRender={(item: CategoryStatistic) => ({
            label: item.operationName,
            key: item.operationName,
          })}
        />
      </Col>

      <Col span={18}>
        <div
          css={css`
            .ant-table {
              margin: -8px 0 0 8px !important;
            }
          `}
        >
          <Table
            columns={categoryColumns}
            dataSource={differenceData}
            pagination={false}
            size="small"
          />
        </div>
      </Col>
    </Row>
  );
};

export default Analysis;
