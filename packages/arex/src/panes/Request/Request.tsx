import { ArexPaneFC, getLocalStorage, useArexPaneProps } from '@arextest/arex-core';
import { ArexRequest, ArexRequestProps, sendRequest } from '@arextest/arex-request';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { processTreeData } from '@/helpers/collection/util';
import { useNavPane } from '@/hooks';
import SaveAs from '@/panes/Request/SaveAs';
import { FileSystemService, ReportService } from '@/services';
import { moveCollectionItem, saveRequest } from '@/services/FileSystemService';
import { useCollections, useEnvironments, useMenusPanes } from '@/store';
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
  const navPane = useNavPane({ inherit: true });
  const { message } = App.useApp();
  const { paneKey } = useArexPaneProps();
  const [activeWorkspaceId, id] = useMemo(() => decodePaneKey(paneKey).id.split('-'), [paneKey]);

  const userName = getLocalStorage<string>(EMAIL_KEY);
  const [saveAsShow, setSaveAsShow] = useState(false);
  const { activeEnvironment, timestamp: timestampEnvironment } = useEnvironments();
  const { collectionsFlatData, collectionsTreeData, getCollections, getPath } = useCollections();
  const { setPanes } = useMenusPanes();

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

  const handleSend: ArexRequestProps['onSend'] = (request) => {
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

  const httpRef = useRef(null);

  const { data: _, run: moveCollectionItemRun } = useRequest(
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
        setSaveAsShow(false);
        getCollections();
      },
      manual: true,
    },
  );

  const { run: addCollectionItem } = useRequest(
    (params: {
      nodeName: string;
      nodeType: CollectionNodeType;
      caseSourceType?: number;
      parentPath: string[];
    }) =>
      FileSystemService.addCollectionItem({
        ...params,
        userName: userName as string,
        id: activeWorkspaceId,
      }),
    {
      manual: true,
      onSuccess: (res, [{ caseSourceType, nodeType }]) => {
        if (res.success) {
          setSaveAsShow(false);
          // 保存完跳转
          // @ts-ignore
          httpRef.current?.onSave({ id: res.infoId });
          setTimeout(() => {
            navPane({
              id: res.infoId,
              type: PanesType.REQUEST,
            });
          }, 300);
        }
      },
    },
  );

  const handleSaveAs = ({ savePath }: { savePath: string }) => {
    // 先添加，再触发 save ！
    addCollectionItem({
      nodeName: 'Untitled',
      nodeType: CollectionNodeType.interface,
      parentPath: getPath(savePath).map((i) => i.id),
    });
  };

  const handleSave: ArexRequestProps['onSave'] = (requestParams, response) => {
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

  const [searchParams] = useSearchParams();
  const { data, run } = useRequest(
    () =>
      FileSystemService.queryRequest({
        id: id as string,
        nodeType: nodeInfo?.nodeType || 1,
        recordId: searchParams.get('recordId') as string,
        planId: searchParams.get('planId') as string,
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
        <ArexRequest
          ref={httpRef}
          disableSave={Boolean(searchParams.get('recordId'))}
          height={`calc(100vh - 110px)`}
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
        <SaveAs
          show={saveAsShow}
          onClose={() => {
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
