import { javascript } from "@codemirror/lang-javascript";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CodeMirror from "@uiw/react-codemirror";
import { Tabs } from "antd";
import { FC, useEffect, useMemo } from "react";

import { useStore } from "../../store";
import FormTable, { getColumns } from "./FormTable";
const { TabPane } = Tabs;

const StatusWrapper = styled.div`
  div {
    margin-right: 16px;
    display: inline-block;
  }
  span {
    color: #10b981;
  }
`;

const Response: FC<
  {
    res: any;
    status: { code: number; text: string };
    time?: number;
    size?: number;
    responseHeaders?: object;
  }
> = (props) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const theme = useStore((state) => state.theme);
  const headers = useMemo(
    () =>
      props.responseHeaders ? Object.entries(props.responseHeaders).map(
        (h) => ({
          key: h[0],
          value: h[1],
        }),
      ) : [],
    [props.responseHeaders],
  );

  useEffect(() => {
    console.log(headers);
  }, [headers]);

  return (
    <>
    <StatusWrapper>
      <div
        css={
          css`
            color: #ff51ab;
          `
        }
      >
        Status：<span>{props.status.code} {props.status.text}</span>
      </div>
      <div>Time：<span>{props.time || 0} ms</span></div>
      <div>Size：<span>{props.size || 0} KB</span></div>
    </StatusWrapper>
    <Tabs defaultActiveKey="1" onChange={onChange}>
      <TabPane tab="Pretty" key="1">
        <CodeMirror
          value={JSON.stringify(props.res, null, 2)}
          extensions={[javascript()]}
          width="100%"
          height="500px"
          theme={theme}
        />
      </TabPane>
      <TabPane tab="Raw" key="2">
        <span style={{ wordBreak: "break-all" }}>
          {JSON.stringify(props.res)}
        </span>
      </TabPane>
      <TabPane tab="Header" key="3">
        <FormTable
          bordered
          showHeader
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={headers}
          // @ts-ignore
          columns={getColumns()}
        />
      </TabPane>
      <TabPane tab="Test Results" key="4">Content of Tab Pane 3</TabPane>
    </Tabs>
    </>
  );
};

export default Response;
