import { css } from '@emotion/react';
import { Breadcrumb } from 'antd';
import { Http } from 'arex-common';
import { FC } from 'react';
const HttpBreadcrumb: FC<{ nodePaths: { title: string }[] }> = ({ nodePaths }) => {
  return (
    <div>
      <Breadcrumb>
        {nodePaths.map((nodePath, index) => (
          <Breadcrumb.Item key={index}>{nodePath.title}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};
const RequestPane = () => {
  const data = {
    _id: '63f45036ad9f1dd47f7cbe62',
    endpoint: '{{url}}/api/listworkspace',
    method: 'POST',
    testScript:
      '\npm.test("Status code is 200", function () {\n    pm.response.to.have.status(200);\n});\n\npm.sendRequest("https://postman-echo.com/get", function (err, response) {\n    console.log(response.json());\n});\n',
    params: [],
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
        active: true,
        id: '0.21981752780770836',
      },
      {
        key: 'Authorization',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndyX3poYW5nMjUiLCJpZCI6IjYzZjQ0ZDhhYjViYTc4ZjA1Y2MxMjJhNyIsInJvbGVzIjpbXSwiaWF0IjoxNjc2OTU1MDE4LCJleHAiOjE5OTI1MzEwMTh9.ZM7VKOlsfHGvhwa71nZttb_uRAcs_OBB6qnZr4Tr_po',
        active: true,
        id: '0.7039784310918862',
      },
    ],
    body: {
      body: '',
      contentType: '',
      _id: '63f45036ad9f1dd47f7cbe63',
    },
    createdAt: '2023-02-21T05:01:42.715Z',
    __v: 0,
  };
  return (
    <div
      css={css`
        height: calc(100vh - 140px);
      `}
    >
      <Http
        breadcrumb={<HttpBreadcrumb nodePaths={[]} />}
        // @ts-ignore
        value={data}
        theme={'light'}
        environment={{ name: '', variables: [] }}
        onSave={(p) => {
          return new Promise((resolve) => resolve(0));
        }}
        onSend={(req) => {
          return new Promise((resolve) => resolve(0));
        }}
        onChangeEditState={(edited) => {
          console.log(edited);
        }}
      />
    </div>
  );
};

export default RequestPane;
