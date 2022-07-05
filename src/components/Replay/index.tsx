import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRequest } from "ahooks";
import { Button, Empty, Tag } from "antd";
import React, { FC, useEffect } from "react";

import { FileSystemService } from "../../api/FileSystem.service";
import { ApplicationDataType } from "../../api/FileSystem.type";

// const columns: ColumnsType<ApplicationDataType> = [
//   {
//     title: "Application",
//     key: "appId",
//     render: (_, record) => <a>{`${record.appId}_${record.appName}`}</a>,
//   },
//   {
//     title: "Default Target Host",
//     dataIndex: "age",
//     key: "age",
//   },
//   {
//     title: "Access CI",
//     render: (_, record) => (
//       <Tag>{(record.features & 1) === 1 ? "ON" : "OFF"}</Tag>
//     ),
//   },
//   {
//     title: "Case Count",
//     dataIndex: "recordedCaseCount",
//     key: "recordedCaseCount",
//   },
//   {
//     title: "Action",
//     key: "action",
//     render: (_, record) => (
//       <Space size="middle">
//         <a>Start replay</a>
//         <a>Lastest report</a>
//       </Space>
//     ),
//   },
// ];

const SubTitle = styled.div`
  height: 22px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .app-name {
    margin: 0 auto 0 0;
  }
  & > *:not(.app-name) {
    margin-left: 16px;
  }
`;

const Replay: FC<{ curApp?: ApplicationDataType }> = ({ curApp }) => {
  useEffect(() => {
    console.log(curApp);
    curApp &&
      queryPlanStatistics({
        appId: curApp.appId,
        needTotal: true,
        pageSize: 100,
        pageIndex: 1,
      });
  }, [curApp]);

  const { data: planStatistics, run: queryPlanStatistics } = useRequest(
    FileSystemService.queryPlanStatistics,
    {
      manual: true,
      onSuccess(res) {
        console.log(res);
      },
    }
  );

  return (
    <>
      {curApp ? (
        <SubTitle>
          <h1 className="app-name">{`${curApp.appId}_${curApp.appName}`}</h1>
          <span>
            <label>Access CI: </label>
            <Tag
              css={css`
                height: 18px;
                line-height: 18px;
                border-radius: 8px;
              `}
            >
              {(curApp.features & 1) === 1 ? "ON" : "OFF"}
            </Tag>
          </span>
          <span>
            <label>Case Count: </label>
            <span>{curApp.recordedCaseCount}</span>
          </span>
          <Button size="small">Start replay</Button>
          <Button size="small">Latest report</Button>
        </SubTitle>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Replay;
