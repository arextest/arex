import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const response = `{
  "method": "GET",
  "args": {

  },
  "data": "",
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "br",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cookie": "_gid=GA1.2.58921975.1655272468; crisp-client%2Fsession%2F3ad30257-c192-4773-955d-fb05a4b41af3=session_35acfed5-3c0d-4df9-8415-a8e07e41511f; _ga=GA1.1.234590366.1643443213; _ga_BBJ3R80PJT=GS1.1.1655355704.8.1.1655358823.0",
    "host": "echo.hoppscotch.io",
    "sec-ch-ua": "\\" Not A;Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"102\\", \\"Google Chrome\\";v=\\"102\\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\\"macOS\\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
    "x-country": "HK",
    "x-forwarded-for": "45.251.106.233, 100.64.0.29",
    "x-forwarded-proto": "https",
    "x-language": "zh-CN",
    "x-nf-client-connection-ip": "45.251.106.233",
    "x-nf-request-id": "01G5NHGJ6HA0EYS7PF88F39DF0"
  },
  "path": "/",
  "isBase64Encoded": true
}`;

const Response = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div style={{ fontStyle: "12px" }}>
      <div style={{ display: "flex" }}>
        <p style={{ marginRight: "14px" }}>
          状态：<span style={{ color: "#10b981" }}>200 OK</span>
        </p>
        <p style={{ marginRight: "14px" }}>
          时间：<span style={{ color: "#10b981" }}>200 OK</span>
        </p>
        <p style={{ marginRight: "14px" }}>
          大小：<span style={{ color: "#10b981" }}>200 OK</span>
        </p>
      </div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="HTML" key="1">
          <CodeMirror
            value={response}
            extensions={[javascript()]}
            width="100%"
            height="500px"
          />
        </TabPane>
        <TabPane tab="原始内容" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="响应头" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="测试结果" key="4">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Response;
