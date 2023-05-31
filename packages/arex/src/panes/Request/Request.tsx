import { useRequest } from 'ahooks';
import { message, Spin } from 'antd';
import { ArexPaneFC, getLocalStorage } from 'arex-core';
import { Http, HttpProps } from 'arex-request-core';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { EMAIL_KEY } from '@/constant';
import { sendRequest } from '@/helpers/postman';
import { FileSystemService, ReportService } from '@/services';
import { saveRequest } from '@/services/FileSystemService';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';

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
  const { id = '' } = useParams();

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

  const handleSave: HttpProps['onSave'] = (requestParams) => {
    FileSystemService.saveRequest(activeWorkspaceId, requestParams, nodeInfo?.nodeType || 1).then(
      (res) => {
        res && message.success('保存成功');
      },
    );
  };

  const { data } = useRequest(() =>
    FileSystemService.queryRequest({
      id: id as string,
      nodeType: nodeInfo?.nodeType || 1,
    }),
  );

  const nodePathId = useMemo(() => getPath(id).map((path) => path.id), [collectionsFlatData, id]);
  const nodePath = useMemo(
    () =>
      getPath(id).map((path) => ({
        title: path.name,
      })),
    [collectionsFlatData, id],
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
      <Spin spinning={!data}>
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
