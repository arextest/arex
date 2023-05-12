import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC, getLocalStorage } from 'arex-core';
import { ConfigProvider as RequestConfigProvider, Http } from 'arex-request-core';
import React, { useMemo } from 'react';

import { EMAIL_KEY } from '@/constant';
import { findAncestors } from '@/helpers/collection/util';
import { sendRequest } from '@/helpers/postman';
import { CollectionTreeType } from '@/menus/Collection/Collection';
import { queryRequest } from '@/services/FileSystemService/request';
import { renameRequest } from '@/services/FileSystemService/request';
import { saveRequest } from '@/services/FileSystemService/request';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';

const Request: ArexPaneFC<CollectionTreeType> = (props) => {
  const { infoId: id } = props.data;

  const { activeEnvironment } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();
  const { collectionsFlatData, getCollections } = useCollections();
  const { theme, language } = useUserProfile();

  const nodeInfo = useMemo(() => {
    return collectionsFlatData.get(id);
  }, [collectionsFlatData, id]);

  // const parentInfos = useMemo(() => {
  //   return findAncestors(collectionsFlatData, id as string)
  //     .reverse()
  //     .concat(collectionsFlatData.get(id);
  // }, [collectionsFlatData, id]);

  function onSend(request: any, environment: any) {
    return sendRequest(request, environment).then((res: any) => {
      return {
        response: res.response,
        testResult: res.testResult,
        consoles: res.consoles,
      };
    });
  }

  function onSave(r: any) {
    saveRequest(activeWorkspaceId, r, nodeInfo?.nodeType || 1).then((res) => {
      if (res) {
        message.success('保存成功');
      }
    });
  }

  const { data } = useRequest(
    () => {
      return queryRequest({ id: id as string, nodeType: nodeInfo?.nodeType || 1 }).then((res) => {
        return res;
      });
    },
    {
      onSuccess() {
        // console.log(collections.find((i) => i.id === id).nodeType, 'collections');
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
      <RequestConfigProvider locale={language} theme={theme}>
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
          breadcrumbItems={[{ title: 'test' }, { title: 'case' }]}
          // breadcrumbItems={parentInfos}
          // onChangeTitle={({ value }) => {
          //   renameRequest({
          //     id: activeWorkspaceId,
          //     newName: value,
          //     path: parentInfos.map((parentInfo) => parentInfo.id),
          //     userName: getLocalStorage(EMAIL_KEY),
          //   }).then((res) => {
          //     getCollections();
          //   });
          // }}
        />
      </RequestConfigProvider>
    </div>
  );
};

export default Request;
