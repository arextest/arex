import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ArexPaneFC, getLocalStorage } from 'arex-core';
import { Http } from 'arex-request-core';
import { HttpProps } from 'arex-request-core/dist/components/http';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';

import { EMAIL_KEY } from '@/constant';
import { sendRequest } from '@/helpers/postman';
import { CollectionTreeType } from '@/menus/Collection/Collection';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments, useUserProfile, useWorkspaces } from '@/store';

export type PathType = {
  title: string;
};

export type RequestProps = CollectionTreeType & { path: PathType[] };

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

  return (
    <div
      css={css`
        height: calc(100vh - 110px);
      `}
    >
      <Http
        theme={theme}
        locale={language}
        value={data}
        config={{}}
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
