import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC, getLocalStorage } from 'arex-core';
import { Http, HttpProps } from 'arex-request-core';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';

import { EMAIL_KEY } from '@/constant';
import { sendRequest } from '@/helpers/postman';
import { CollectionTreeType } from '@/menus/Collection/Collection';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';

import { ExtraTabs } from './extra';

export type PathType = {
  title: string;
};

export type RequestProps = CollectionTreeType & { path: PathType[] };
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
const Request: ArexPaneFC<RequestProps> = (props) => {
  const { infoId: id } = props.data;

  const userName = getLocalStorage<string>(EMAIL_KEY);

  const { activeEnvironment } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();
  const { collectionsFlatData, getCollections, getPath } = useCollections();
  const { theme, language } = useUserProfile();

  const [path, setPath] = useImmer<PathType[]>(props.data.path || []);

  const nodeInfo = useMemo(() => {
    return collectionsFlatData.get(id);
  }, [collectionsFlatData, id]);

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
    console.log(requestParams, 's');
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

  const nodePath = useMemo(() => getPath(props.data.infoId), [getPath, props.data.infoId]);

  const { run: rename } = useRequest(
    (newName) =>
      FileSystemService.renameCollectionItem({
        id: activeWorkspaceId,
        newName,
        path: nodePath,
        userName: userName as string,
      }),
    {
      manual: true,
      onSuccess(success, [newName]) {
        setPath((prev) => {
          prev[prev.length - 1].title = newName;
        });
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
      <Http
        height={`calc(100vh - 110px)`}
        theme={theme}
        locale={language}
        value={data}
        config={httpConfig}
        environment={environment}
        breadcrumbItems={path}
        onSave={handleSave}
        onSend={handleSend}
        onChangeTitle={({ value }) => rename(value)}
      />
    </div>
  );
};

export default Request;
