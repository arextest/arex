import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC, getLocalStorage } from 'arex-core';
import { Http, HttpProps } from 'arex-request-core';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { EMAIL_KEY } from '@/constant';
import { sendRequest } from '@/helpers/postman';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';

import { ExtraTabs } from './extra';

export type PathType = {
  title: string;
};

const Request: ArexPaneFC = () => {
  const { id = '' } = useParams();

  const userName = getLocalStorage<string>(EMAIL_KEY);

  const { activeEnvironment } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();
  const { collectionsFlatData, getCollections, getPath } = useCollections();
  const { theme, language } = useUserProfile();

  const [path, setPath] = useImmer<PathType[]>([]);

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
    return sendRequest(request, environment).then((res) => {
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

  const { data } = useRequest(
    () =>
      FileSystemService.queryRequest({
        id: id as string,
        nodeType: nodeInfo?.nodeType || 1,
      }),
    {
      onSuccess(res) {
        // parent path breadcrumb
        const defaultPath: { title: string }[] = [{ title: res.name }];
        let pid = collectionsFlatData.get(res.id!)?.pid;
        while (pid) {
          const node = collectionsFlatData.get(pid);
          if (node) {
            defaultPath.unshift({ title: node.nodeName });
            pid = node.pid;
          } else {
            break;
          }
        }
        setPath(defaultPath);
      },
    },
  );

  const nodePath = useMemo(() => getPath(id), [getPath, id]);

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
