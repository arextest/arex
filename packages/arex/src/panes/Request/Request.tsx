import { css } from '@emotion/react';
import { message } from 'antd';
import { Theme } from 'arex-core/src';
import { ConfigProvider as RequestConfigProvider, Http } from 'arex-request-core';
// import { Http } from 'arex-request-core';
import { useMemo } from 'react';

import { sendRequest } from '../../helpers/postman';
const Request = () => {
  function onSend(request: any, environment: any) {
    return sendRequest(request, environment).then((res: any) => {
      return {
        response: res.response,
        testResult: res.testResult,
      };
    });
  }
  const testReqaData = useMemo(() => {
    return {
      preRequestScript: '',
      v: '',
      headers: [],
      name: '',
      body: { contentType: 'application/json', body: '' } as any,
      auth: { authActive: false, authType: 'none' } as any,
      testScript: '',
      endpoint: '',
      method: 'GET',
      params: [],
    };
  }, []);
  function onSave(r: any) {
    localStorage.setItem('req', JSON.stringify(r));
    message.success('保存成功');
  }
  return (
    <div
      css={css`
        height: 500px;
      `}
    >
      <RequestConfigProvider locale={'zh_CN'} theme={'dark'}>
        <Http
          onSend={(request) => {
            return onSend(request, {
              name: 'dev',
              variables: [{ key: 'url', value: 'https://m.weibo.cn' }],
            });
          }}
          onSave={onSave}
          value={testReqaData}
          breadcrumb={<div></div>}
          environment={{ name: 'dev', variables: [{ key: 'url', value: 'https://m.weibo.cn' }] }}
          config={{}}
        />
      </RequestConfigProvider>
    </div>
  );
};

export default Request;
