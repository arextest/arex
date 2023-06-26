import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Spin } from 'antd';
import { ArexPaneFC, getLocalStorage, useArexPaneProps } from '@arextest/arex-core';
import { Http, HttpProps } from 'arex-request-core';
import React, { useMemo } from 'react';

import { EMAIL_KEY } from '@/constant';
import { sendRequest } from '@/helpers/postman';
import { FileSystemService, ReportService } from '@/services';
import { saveRequest } from '@/services/FileSystemService';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import { ExtraTabs } from './extra';

export type PathType = {
  title: string;
};

function convertRequest(request: any) {
  if (request.inherited) {
    return {
      ...request,
      method: request.inheritedMethod,
      endpoint: request.inheritedEndpoint,
    };
  } else {
    return request;
  }
}

const Request: ArexPaneFC = () => {
  const { message } = App.useApp();
  const { paneKey } = useArexPaneProps();
  const { id } = useMemo(() => decodePaneKey(paneKey), []);

  const userName = getLocalStorage<string>(EMAIL_KEY);

  const { activeEnvironment } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();
  const { collectionsFlatData, getCollections, getPath } = useCollections();
  const { theme, language } = useUserProfile();

  const { data: labelData, run: queryLabels } = useRequest(
    () => ReportService.queryLabels({ workspaceId: activeWorkspaceId as string }),
    { ready: !!activeWorkspaceId },
  );

  const nodeInfo = useMemo(() => collectionsFlatData.get(id), [collectionsFlatData, id]);

  const environment = useMemo(
    () => ({
      name: activeEnvironment?.envName || '',
      variables: activeEnvironment?.keyValues || [],
    }),
    [activeEnvironment],
  );

  const handleSend: HttpProps['onSend'] = (request) => {
    // TODO 这里使用继承
    const convertedRequest = convertRequest(request);
    return sendRequest(convertedRequest, environment).then((res) => {
      return {
        response: res.response,
        testResult: res.testResult,
        consoles: res.consoles,
      };
    });
  };

  const handleSave: HttpProps['onSave'] = (requestParams, response) => {
    console.log(response);
    const request = requestParams;
    if (
      !request.headers.find((i) => i.key === 'arex-record-id') &&
      (response?.type === 'success' ? response.headers : []).find(
        (i) => i.key === 'arex-record-id',
      ) &&
      request.headers.find((i) => i.key === 'arex-force-record')?.active
    ) {
      const recordId =
        response?.type === 'success'
          ? response.headers.find((i) => i.key === 'arex-record-id')?.value
          : '';

      runPinMock(recordId);
    }
    FileSystemService.saveRequest(activeWorkspaceId, requestParams, nodeInfo?.nodeType || 1).then(
      (res) => {
        res && message.success('保存成功');
      },
    );
  };

  const { data, run } = useRequest(
    () =>
      FileSystemService.queryRequest({
        id: id as string,
        nodeType: nodeInfo?.nodeType || 1,
      }),
    {
      refreshDeps: [nodeInfo?.nodeType],
    },
  );

  const nodePathId = useMemo(() => getPath(id).map((path) => path.id), [collectionsFlatData, id]);
  const nodePath = useMemo(
    () =>
      getPath(id).map((path) => ({
        title: path.name,
      })),
    [collectionsFlatData, id],
  );
  const { run: runPinMock } = useRequest(
    (recordId) =>
      FileSystemService.pinMock({
        workspaceId: activeWorkspaceId as string,
        infoId: id,
        recordId,
        nodeType: nodeInfo?.nodeType || 2,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess: (success) => {
        if (success) {
          message.success('pin success');
          run();
          // httpRef.current?.forceReRendering();
        }
      },
    },
  );
  const { run: rename } = useRequest(
    (newName) =>
      FileSystemService.renameCollectionItem({
        id: activeWorkspaceId,
        newName,
        path: nodePathId,
        userName: userName as string,
      }),
    {
      manual: true,
      onSuccess(success) {
        getCollections(activeWorkspaceId);
      },
    },
  );
  const httpConfig = useMemo(() => {
    return {
      requestTabs: {
        extra: [
          {
            label: 'Mock',
            key: 'mock',
            hidden: !data?.recordId,
            children: <ExtraTabs.RequestTabs.Mock recordId={data?.recordId as string} />,
          },
        ],
      },
      responseTabs: {
        extra: [],
      },
    };
  }, [data]);

  return (
    <div>
      <Spin
        css={css`
          height: calc(100vh - 110px);
          width: 100%;
        `}
        spinning={!data}
      >
        {nodeInfo && data && (
          <Http
            height={`calc(100vh - 110px)`}
            theme={theme}
            locale={language}
            value={data}
            config={httpConfig}
            environment={environment}
            breadcrumbItems={nodePath}
            onSave={handleSave}
            onSend={handleSend}
            description={data?.description || ''}
            // @ts-ignore
            tags={data?.tags || []}
            tagOptions={(labelData || []).map((i) => ({
              label: i.labelName,
              value: i.id,
              color: i.color,
            }))}
            onChange={({ title, description, tags }) => {
              if (title) {
                rename(title);
              }
              if (description) {
                saveRequest(
                  activeWorkspaceId,
                  {
                    id: data?.id,
                    description,
                  },
                  nodeInfo?.nodeType || 1,
                );
              }
              if (tags) {
                saveRequest(
                  activeWorkspaceId,
                  {
                    id: data?.id,
                    tags,
                  },
                  nodeInfo?.nodeType || 1,
                );
              }
            }}
          />
        )}
      </Spin>
    </div>
  );
};

export default Request;
