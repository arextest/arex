import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC } from 'arex-core/src';
import { ConfigProvider as RequestConfigProvider, Http } from 'arex-request-core';
import { useParams } from 'react-router-dom';

import { queryRequest } from '@/services/FileSystemService/request/queryRequest';
import { saveRequest } from '@/services/FileSystemService/request/saveRequest';
import { useEnvironments } from '@/store';

import { sendRequest } from '../../helpers/postman';
const Request: ArexPaneFC = (props) => {
  const pam = useParams();
  const { activeEnvironment } = useEnvironments();
  function onSend(request: any, environment: any) {
    return sendRequest(request, environment).then((res: any) => {
      return {
        response: res.response,
        testResult: res.testResult,
      };
    });
  }

  function onSave(r: any) {
    saveRequest(pam.workspaceId as string, r).then((res) => {
      if (res) {
        message.success('保存成功');
      }
    });
  }

  const { data } = useRequest(() => {
    return queryRequest({ id: pam.id as string }).then((res) => {
      return res;
    });
  }, {});

  return (
    <div
      css={css`
        height: calc(100vh - 110px);
      `}
    >
      <RequestConfigProvider locale={'en'} theme={'light'}>
        <Http
          onSend={(request) => {
            return onSend(request, {
              name: activeEnvironment?.envName || '',
              variables: activeEnvironment?.keyValues || [],
            });
          }}
          onSave={onSave}
          // @ts-ignore
          value={data}
          breadcrumb={<div></div>}
          environment={{
            name: activeEnvironment?.envName || '',
            variables: activeEnvironment?.keyValues || [],
          }}
          config={{}}
        />
      </RequestConfigProvider>
    </div>
  );
};

export default Request;
