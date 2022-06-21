import {
  CheckCircleOutlined,
  CodeOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import styled from "@emotion/styled";
import CodeMirror from "@uiw/react-codemirror";
import { useRequest } from "ahooks";
import {
  Button,
  Divider,
  Dropdown,
  Empty,
  Input,
  Menu,
  message,
  Select,
  Space,
  Table,
  TableProps,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { FC, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";

import AnimateAutoHeight from "../AnimateAutoHeight";
import Response from "./Response";
import ResponseCompare from "./ResponseCompare";

type ParamsType = {
  id: string;
  key: string;
  value: string | number;
  disabled: boolean;
};

const { TabPane } = Tabs;

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
  .ant-btn-group {
    margin-left: 16px;
  }
`;

const StyledTable = styled(Table)<TableProps<ParamsType>>`
  .ant-table-thead {
    display: none;
  }
  .ant-table-cell {
    padding: 0 1px !important;
  }
`;

const CountTag = styled(Tag)`
  border-radius: 8px;
  padding: 0 6px;
`;

const FormHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -8px;
  & > span:first-of-type {
    font-size: 13px;
    line-height: 32px;
    font-weight: 500;
    color: #9d9d9d;
  }
`;

const ResponseWrapper = styled.div`
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Http: FC<{ mode?: "normal" | "compare" }> = ({ mode = "normal" }) => {
  const [requestType, setRequestType] = useState("GET");
  const [requestSavedName, setRequestSavedName] = useState("Untitled request");

  const [url, setUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [response, setResponse] = useState<any>();
  const [params, setParams] = useImmer<ParamsType[]>([
    { id: uuidv4(), key: "", value: "", disabled: false },
  ]);
  const paramsCount = useMemo(
    () =>
      params.reduce((count, param) => {
        param.key && count++;
        return count;
      }, 0),
    [params]
  );
  const [requestHeader, setRequestHeader] = useImmer([
    {
      id: uuidv4(),
      key: "",
      value: "",
      disabled: false,
    },
  ]);
  const headerCount = useMemo(
    () =>
      requestHeader.reduce((count, h) => {
        h.key && count++;
        return count;
      }, 0),
    [params]
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
    onFinally: () => {
      setSent(true);
    },
  });

  const handleRequest = () => {
    if (!url) return message.warn("Please input url");

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
    } else {
      try {
        data.data = JSON.parse(requestBody);
      } catch (e) {
        message.warn("Invalid JSON");
        return new Error("Invalid JSON");
      }
    }

    request(url, {
      method: requestType,
      ...data,
    });
  };

  const FormHeader: FC<{ target: "params" | "requestHeader" }> = ({
    target = "params",
  }) => {
    const handleAddParam = () => {
      const newValue = {
        id: uuidv4(),
        key: "",
        value: "",
        disabled: false,
      };
      if (target === "params") {
        setParams((params) => {
          params.push(newValue);
        });
      } else {
        setRequestHeader((requestHeader) => {
          requestHeader.push(newValue);
        });
      }
    };
    const handleClearAllParams = () =>
      target === "params" ? setParams([]) : setRequestHeader([]);

    return (
      <FormHeaderWrapper>
        <span>查询参数</span>
        <div>
          <Tooltip title="帮助">
            <Button type="text" icon={<QuestionCircleOutlined />} />
          </Tooltip>

          <Tooltip title="全部清除">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={handleClearAllParams}
            />
          </Tooltip>

          <Tooltip title="批量编辑">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>

          <Tooltip title="新增">
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={handleAddParam}
            />
          </Tooltip>
        </div>
      </FormHeaderWrapper>
    );
  };

  const getColumns = (
    target: "params" | "requestHeader"
  ): ColumnsType<ParamsType> => {
    const handleChange = (i: number, attr: "key" | "value", value: string) => {
      if (target === "params") {
        setParams((params) => {
          params[i][attr] = value;
        });
      } else {
        setRequestHeader((requestHeader) => {
          requestHeader[i][attr] = value;
        });
      }
    };

    const handleDisable = (i: number) => {
      if (target === "params") {
        setParams((params) => {
          params[i].disabled = !params[i].disabled;
        });
      } else {
        setRequestHeader((requestHeader) => {
          requestHeader[i].disabled = !params[i].disabled;
        });
      }
    };

    return [
      {
        title: "参数",
        dataIndex: "key",
        key: "key",
        render: (text, record, i) => (
          <Input
            value={text}
            bordered={false}
            placeholder="参数"
            disabled={record.disabled}
            onChange={(e) => handleChange(i, "key", e.target.value)}
          />
        ),
      },
      {
        title: "值",
        dataIndex: "value",
        key: "value",
        render: (text, record, i) => (
          <Input
            value={text}
            bordered={false}
            placeholder="值"
            disabled={record.disabled}
            onChange={(e) => handleChange(i, "value", e.target.value)}
          />
        ),
      },
      {
        title: "操作",
        key: "actions",
        width: 72,
        align: "center",
        className: "actions",
        render: (text, record, i) => (
          <Space>
            <Tooltip title={record.disabled ? "开启" : "关闭"}>
              <Button
                type="text"
                size="small"
                icon={
                  record.disabled ? <StopOutlined /> : <CheckCircleOutlined />
                }
                onClick={() => handleDisable(i)}
              />
            </Tooltip>
            <Tooltip title="移除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() =>
                  setParams((params) => {
                    params.splice(i, 1);
                  })
                }
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
  };

  return (
    <>
      <AnimateAutoHeight>
        <HeaderWrapper>
          <Select
            value={requestType}
            options={RequestTypeOptions}
            onChange={setRequestType}
          />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            onClick={handleRequest}
            overlay={
              <Menu
                items={[
                  {
                    key: "1",
                    label: "导入URL",
                    icon: <LinkOutlined />,
                  },
                  {
                    key: "2",
                    label: "显示代码",
                    icon: <CodeOutlined />,
                  },
                  {
                    key: "3",
                    label: "全部清除",
                    icon: <DeleteOutlined />,
                  },
                ]}
              />
            }
          >
            发送
          </Dropdown.Button>

          <Dropdown.Button
            icon={<DownOutlined />}
            overlay={
              <Menu
                items={[
                  {
                    key: "0",
                    label: (
                      <Input
                        value={requestSavedName}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setRequestSavedName(e.target.value)}
                      />
                    ),
                  },
                  {
                    key: "1",
                    label: "复制链接",
                    icon: <CopyOutlined />,
                  },
                  {
                    key: "2",
                    label: "View my links",
                    icon: <LinkOutlined />,
                  },
                  {
                    key: "3",
                    label: "另存为",
                    icon: <SaveOutlined />,
                  },
                ]}
              />
            }
          >
            保存
          </Dropdown.Button>
        </HeaderWrapper>

        <Tabs defaultActiveKey="0">
          <TabPane
            tab={
              <span>
                参数 {!!paramsCount && <CountTag>{paramsCount}</CountTag>}
              </span>
            }
            key="0"
          >
            <FormHeader target="params" />
            <StyledTable
              bordered
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={params}
              // @ts-ignore
              columns={getColumns("params")}
            />
          </TabPane>
          <TabPane tab="请求体" key="1">
            <FormHeaderWrapper>
              <span>
                内容类型
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
                请求头 {!!headerCount && <CountTag>{headerCount}</CountTag>}
              </span>
            }
            key="2"
          >
            <FormHeader target="requestHeader" />
            <StyledTable
              bordered
              size="small"
              pagination={false}
              dataSource={requestHeader}
              // @ts-ignore
              columns={getColumns("requestHeader")}
            />
          </TabPane>
          <TabPane tab="授权" key="3">
            <CodeMirror value="" extensions={[json()]} height="300px" />
          </TabPane>
          <TabPane tab="预请求脚本" key="4">
            <CodeMirror value="" height="300px" extensions={[javascript()]} />
          </TabPane>
          <TabPane tab="测试" key="5">
            <CodeMirror value="" height="300px" extensions={[javascript()]} />
          </TabPane>
        </Tabs>
      </AnimateAutoHeight>
      <Divider />
      <div>
        {sent ? (
          mode === "normal" ? (
            <Response
              res={res}
              status={{ code: response.status, text: response.statusText }}
            />
          ) : (
            <ResponseCompare />
          )
        ) : (
          <ResponseWrapper>
            <Empty description="Enter the URL and click Send to get a response" />
          </ResponseWrapper>
        )}
      </div>
    </>
  );
};

export default Http;
