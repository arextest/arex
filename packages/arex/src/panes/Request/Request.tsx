import { ArexPaneFC, getLocalStorage, useArexPaneProps } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Spin } from 'antd';
import { Http, HttpProps } from 'arex-request-core';
import React, { useMemo, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { processTreeData } from '@/helpers/collection/util';
import { sendRequest } from '@/helpers/postman';
import SaveAs from '@/panes/Request/SaveAs';
import { FileSystemService, ReportService } from '@/services';
import { moveCollectionItem, saveRequest } from '@/services/FileSystemService';
import {
  useCollections,
  useEnvironments,
  useMenusPanes,
  useUserProfile,
  useWorkspaces,
} from '@/store';
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
  const [saveAsShow, setSaveAsShow] = useState(false);
  const { activeEnvironment } = useEnvironments();
  const { activeWorkspaceId } = useWorkspaces();
  const { collectionsFlatData, collectionsTreeData, getCollections, getPath } = useCollections();
  const { setPanes } = useMenusPanes();
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

  const { data: _, runAsync: moveCollectionItemRunAsync } = useRequest(
    (params) => {
      return moveCollectionItem({
        fromNodePath: getPath(id).map((p) => p.id),
        toIndex: 0,
        toParentPath: getPath(params.toParentPath).map((p) => p.id),
        id: activeWorkspaceId,
      });
    },
    {
      onSuccess() {
        getCollections();
      },
      manual: true,
    },
  );
  const handleSaveAs = ({ savePath }: { savePath: string }) => {
    moveCollectionItemRunAsync({ toParentPath: savePath }).then(() => {
      setSaveAsShow(false);
    });
  };

  const handleSave: HttpProps['onSave'] = (requestParams, response) => {
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
        getCollections();
        const { id, type } = decodePaneKey(paneKey);
        setPanes({
          id,
          type,
          icon: requestParams.method,
        });
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
      onSuccess(success, [name]) {
        if (success) {
          getCollections(activeWorkspaceId);
          const { id, type } = decodePaneKey(paneKey);
          setPanes({
            id,
            type,
            name,
          });
        }
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
            onSaveAs={() => {
              setSaveAsShow(true);
            }}
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
        <SaveAs
          show={saveAsShow}
          onHide={() => {
            setSaveAsShow(false);
          }}
          onOk={handleSaveAs}
          collection={processTreeData(collectionsTreeData.filter((item) => item.nodeType !== 1))}
        />
      </Spin>
    </div>
  );
};

export default Request;
