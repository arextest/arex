import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CodeMirror from "@uiw/react-codemirror";
import { useRequest } from "ahooks";
import {
  Badge,
  Breadcrumb,
  Button,
  Divider,
  // Dropdown,
  Empty,
  Input,
  message,
  Select,
  Tabs,
  Tag,
} from "antd";
import axios from "axios";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";

import AnimateAutoHeight from "../AnimateAutoHeight";
import FormHeader, { FormHeaderWrapper } from "./FormHeader";
import FormTable, { getColumns } from "./FormTable";
import Response from "./Response";
import ResponseCompare from "./ResponseCompare";

const { TabPane } = Tabs;

export type ParamsType = {
  id: string;
  key: string;
  value: string | number;
  disabled: boolean;
};

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
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;

const CountTag = styled(Tag)`
  border-radius: 8px;
  padding: 0 6px;
  margin-left: 4px;
`;

const ResponseWrapper = styled.div`
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Http: FC<{ mode?: "normal" | "compare" ,selectedRequest:{id:string,path:[]}}> = ({ mode = "normal",selectedRequest }) => {
  const { t: t_common } = useTranslation("common");
  const { t: t_components } = useTranslation("components");

  const [requestType, setRequestType] = useState("GET");
  // const [requestSavedName, setRequestSavedName] = useState<string>(
  //   t_components("http.untitledRequest")
  // );

  const [url, setUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [response, setResponse] = useState<any>();
  const [params, setParams] = useImmer<ParamsType[]>([
    { id: uuidv4(), key: "", value: "", disabled: false },
  ]);
  const paramsCount = useMemo(
    () =>
      params.reduce((count, param) => {
        param.key && !param.disabled && count++;
        return count;
      }, 0),
    [params]
  );
  const [requestHeader, setRequestHeader] = useImmer<ParamsType[]>([
    {
      id: uuidv4(),
      key: "",
      value: "",
      disabled: false,
    },
  ]);
  const headerCount = useMemo(
    () =>
      requestHeader.reduce((count, header) => {
        header.key && !header.disabled && count++;
        return count;
      }, 0),
    [requestHeader]
  );

  const [requestBody, setRequestBody] = useState("");

  const { data: res, run: request } = useRequest(axios, {
    manual: true,
    onBefore: () => {
      setSent(false);
    },
    onSuccess: (res) => {
      console.log(res);
      setResponse(res);
    },
    onError(err) {
      console.log(err);
      setResponse(err?.response);
    },
    onFinally: () => {
      console.log("finally", res);
      setSent(true);
    },
  });

  const handleRequest = () => {
    if (!url) return message.warn(t_components("http.urlEmpty"));

    const data: Partial<Record<"params" | "data", object>> = {};
    if (requestType === "GET") {
      data.params = params.reduce<{
        [key: string]: string | number;
      }>((acc, { key, value, disabled }) => {
        if (key && !disabled) {
          acc[key] = value;
        }
        return acc;
      }, {});
    } else if (requestBody) {
      try {
        data.data = JSON.parse(requestBody);
      } catch (e) {
        message.warn(t_common("invalidJSON"));
        return new Error(t_common("invalidJSON"));
      }
    }

    const headers = requestHeader.reduce<{
      [key: string]: string | number;
    }>((acc, header) => {
      if (header.key) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    request(url, {
      method: requestType,
      headers,
      ...data,
    });
  };

  return (
    <>
      <AnimateAutoHeight>
        <Breadcrumb style={{paddingBottom:'14px',paddingTop:'14px'}}>
          {selectedRequest.path.map(i=>{
            return <Breadcrumb.Item>{i}</Breadcrumb.Item>
          })}
        </Breadcrumb>
        <HeaderWrapper>
          <Select
            value={requestType}
            options={RequestTypeOptions}
            onChange={setRequestType}
          />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button
            // DropdownButton
            type="primary"
            // icon={<DownOutlined />}
            onClick={handleRequest}
            // overlay={
            //   <Menu
            //     items={[
            //       {
            //         key: "1",
            //         label: t_components("http.importUrl"),
            //         icon: <LinkOutlined />,
            //       },
            //       {
            //         key: "2",
            //         label: t_components("http.showCode"),
            //         icon: <CodeOutlined />,
            //       },
            //       {
            //         key: "3",
            //         label: t_components("http.clearAll"),
            //         icon: <DeleteOutlined />,
            //       },
            //     ]}
            //   />
            // }
          >
            {t_common("send")}
          </Button>

          <Button
          // DropdownButton
          // icon={<DownOutlined />}
          // overlay={
          //   <Menu
          //     items={[
          //       {
          //         key: "0",
          //         label: (
          //           <Input
          //             value={requestSavedName}
          //             onClick={(e) => e.stopPropagation()}
          //             onChange={(e) => setRequestSavedName(e.target.value)}
          //           />
          //         ),
          //       },
          //       {
          //         key: "1",
          //         label: t_components("http.copyLink"),
          //         icon: <CopyOutlined />,
          //       },
          //       {
          //         key: "2",
          //         label: t_components("http.viewMyLinks"),
          //         icon: <LinkOutlined />,
          //       },
          //       {
          //         key: "3",
          //         label: t_components("http.saveAs"),
          //         icon: <SaveOutlined />,
          //       },
          //     ]}
          //   />
          // }
          >
            {t_common("save")}
          </Button>
        </HeaderWrapper>

        <Tabs defaultActiveKey="0">
          <TabPane
            tab={
              <span>
                {t_components("http.params")}
                {!!paramsCount && <CountTag>{paramsCount}</CountTag>}
              </span>
            }
            key="0"
          >
            <FormHeader update={setParams} />
            <FormTable
              bordered
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={params}
              // @ts-ignore
              columns={getColumns(setParams)}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Badge
                  dot={!!requestBody}
                  status={requestType === "POST" ? "success" : "default"}
                >
                  {t_components("http.requestBody")}
                </Badge>
              </span>
            }
            key="1"
          >
            <FormHeaderWrapper>
              <span>
                {t_components("http.contentType")}
                <Select
                  disabled
                  value={"json"}
                  size={"small"}
                  options={[{ value: "json", label: "application/json" }]}
                  style={{ width: "140px", marginLeft: "8px" }}
                />
              </span>
            </FormHeaderWrapper>
            <CodeMirror
              value={requestBody}
              extensions={[json()]}
              height="auto"
              minHeight={"100px"}
              onChange={setRequestBody}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                {t_components("http.requestHeader")}{" "}
                {!!headerCount && <CountTag>{headerCount}</CountTag>}
              </span>
            }
            key="2"
          >
            <FormHeader update={setRequestHeader} />
            <FormTable
              bordered
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={requestHeader}
              // @ts-ignore
              columns={getColumns(setRequestHeader)}
            />
          </TabPane>
          <TabPane tab={t_components("http.authorization")} key="3" disabled>
            <CodeMirror value="" extensions={[json()]} height="300px" />
          </TabPane>
          <TabPane
            tab={t_components("http.pre-requestScript")}
            key="4"
            disabled
          >
            <CodeMirror value="" height="300px" extensions={[javascript()]} />
          </TabPane>
          <TabPane tab={t_components("http.test")} key="5" disabled>
            <CodeMirror value="" height="300px" extensions={[javascript()]} />
          </TabPane>
        </Tabs>
      </AnimateAutoHeight>
      <Divider />
      <div>
        {sent ? (
          mode === "normal" ? (
            <Response
              res={response?.data || response?.statusText}
              status={{ code: response.status, text: response.statusText }}
            />
          ) : (
            <ResponseCompare />
          )
        ) : (
          <ResponseWrapper>
            <Empty description={t_components("http.responseNotReady")} />
          </ResponseWrapper>
        )}
      </div>
    </>
  );
};

export default Http;
