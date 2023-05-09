import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC } from 'arex-core/src';
import { ConfigProvider as RequestConfigProvider, Http } from 'arex-request-core';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { queryRequest } from '@/services/FileSystemService/request/queryRequest';
import { renameRequest } from '@/services/FileSystemService/request/renameRequest';
import { saveRequest } from '@/services/FileSystemService/request/saveRequest';
import { useCollections, useEnvironments } from '@/store';

import { sendRequest } from '../../helpers/postman';
function findAncestors(arr: any[], id: string) {
  const res = [];
  let node = arr.find((item) => item.id === id);
  while (node && node.pid) {
    const parent = arr.find((item) => item.id === node.pid);
    if (parent) {
      res.push(parent);
      node = parent;
    } else {
      node = null;
    }
  }
  return res;
}
const Request: ArexPaneFC = (props) => {
  const pam = useParams();
  const { activeEnvironment } = useEnvironments();
  const { collections, getCollections } = useCollections();
  const nodeInfo = useMemo(() => {
    return collections.find((collection) => collection.id === pam.id);
  }, [collections, pam.id]);
  const parentInfos = useMemo(() => {
    return findAncestors(collections, pam.id as string)
      .reverse()
      .concat(collections.find((collection) => collection.id === pam.id));
  }, [collections, pam.id]);
  function onSend(request: any, environment: any) {
    return sendRequest(request, environment).then((res: any) => {
      return {
        response: res.response,
        testResult: res.testResult,
      };
    });
  }

  function onSave(r: any) {
    saveRequest(pam.workspaceId as string, r, nodeInfo?.nodeType || 1).then((res) => {
      if (res) {
        message.success('保存成功');
      }
    });
  }

  const { data } = useRequest(
    () => {
      return queryRequest({ id: pam.id as string, nodeType: nodeInfo?.nodeType || 1 }).then(
        (res) => {
          return res;
        },
      );
    },
    {
      onSuccess() {
        // console.log(collections.find((i) => i.id === pam.id).nodeType, 'collections');
      },
    },
  );

  return (
    <div
      css={css`
        height: calc(100vh - 110px);
      `}
    >
      {/*{nodeInfo?.title}*/}
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
          breadcrumbItems={parentInfos}
          onChangeTitle={({ value }) => {
            renameRequest({
              id: pam.workspaceId,
              newName: value,
              path: parentInfos.map((parentInfo) => parentInfo.id),
              userName: 'tzhangm@trip.com',
            }).then((res) => {
              getCollections(pam.workspaceId);
            });
          }}
        />
      </RequestConfigProvider>
    </div>
  );
};

export default Request;
