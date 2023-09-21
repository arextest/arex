import { ArexPaneFC, getLocalStorage } from '@arextest/arex-core';
import {
  ArexEnvironment,
  ArexRequest,
  ArexRequestProps,
  ArexRESTRequest,
} from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { processTreeData } from '@/helpers/collection/util';
import { useNavPane } from '@/hooks';
import { EnvironmentService, FileSystemService, ReportService } from '@/services';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import { ExtraTabs } from './extra';
import SaveAs from './SaveAs';

function convertRequest(request: ArexRESTRequest) {
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

export type RequestProps = {
  recordId?: string;
  planId?: string;
  environmentId?: string;
};

const Request: ArexPaneFC<RequestProps> = (props) => {
  const navPane = useNavPane({ inherit: true });
  const { message } = App.useApp();
  const { id: paneId, type } = decodePaneKey(props.paneKey);
  const [workspaceId, id] = useMemo(() => paneId.split('-'), [paneId]);

  const { collectionsFlatData, collectionsTreeData, getCollections, getPath } = useCollections();
  const nodeInfo = useMemo(() => collectionsFlatData.get(id), [collectionsFlatData, id]);

  const httpRef = useRef(null);

  const userName = getLocalStorage<string>(EMAIL_KEY);
  const [saveAsShow, setSaveAsShow] = useState(false);

  const [activeEnvironment, setActiveEnvironment] = useState<ArexEnvironment>();

  const { data: labelData = [] } = useRequest(() => ReportService.queryLabels({ workspaceId }));
  const tagOptions = useMemo(
    () =>
      labelData.map((i) => ({
        label: i.labelName,
        value: i.id,
        color: i.color,
      })),
    [labelData],
  );

  const nodePathId = useMemo(() => getPath(id).map((path) => path.id), [collectionsFlatData, id]);
  const nodePath = useMemo(
    () =>
      getPath(id).map((path) => ({
        title: path.name,
      })),
    [collectionsFlatData, id],
  );

  const { data: environments } = useRequest(EnvironmentService.getEnvironments, {
    defaultParams: [{ workspaceId }],
    onSuccess(res) {
      if (props.data.environmentId) {
        const env = res.find((env) => env.id === props.data.environmentId);
        setActiveEnvironment(env);
      }
    },
  });

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
        id: workspaceId,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          setSaveAsShow(false);
          // 保存完跳转
          // httpRef.current?.onSave({ id: res.infoId });
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
      !request?.headers.find((i) => i.key === 'arex-record-id') &&
      (response?.type === 'success' ? response.headers : []).find(
        (i) => i.key === 'arex-record-id',
      ) &&
      request?.headers.find((i) => i.key === 'arex-force-record')?.active
    ) {
      const recordId =
        response?.type === 'success'
          ? response.headers.find((i) => i.key === 'arex-record-id')?.value
          : '';

      runPinMock(recordId);
    }
    FileSystemService.saveRequest(workspaceId, requestParams, nodeInfo?.nodeType || 1).then(
      (res) => {
        res && message.success('保存成功');
        getCollections();
        navPane({
          id: paneId,
          type,
          icon: requestParams?.method,
        });
      },
    );
  };

  const { data, run } = useRequest(
    () =>
      FileSystemService.queryRequest({
        id: id as string,
        nodeType: nodeInfo?.nodeType || 1,
        recordId: props.data?.recordId,
        planId: props.data.planId,
      }),
    {
      refreshDeps: [nodeInfo?.nodeType],
    },
  );

  const { run: runPinMock } = useRequest(
    (recordId) =>
      FileSystemService.pinMock({
        workspaceId: workspaceId as string,
        infoId: id,
        recordId,
        nodeType: nodeInfo?.nodeType || 2,
      }),
    {
      manual: true,
      ready: !!workspaceId,
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
        id: workspaceId,
        newName,
        path: nodePathId,
        userName: userName as string,
      }),
    {
      manual: true,
      onSuccess(success, [name]) {
        if (success) {
          getCollections(workspaceId);
          navPane({
            id: paneId,
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

  const handleEnvironmentChange: ArexRequestProps['onEnvironmentChange'] = (environment) => {
    navPane({
      id: paneId,
      type,
      data: {
        environmentId: environment?.id,
      },
    });
    setActiveEnvironment(environment);
  };
  return (
    <>
      <ArexRequest
        ref={httpRef}
        loading={!data}
        height='calc(100vh - 110px)'
        data={data}
        config={httpConfig}
        environmentId={activeEnvironment?.id}
        environments={environments}
        onEnvironmentChange={handleEnvironmentChange}
        breadcrumbItems={nodePath}
        description={data?.description}
        tags={data?.tags}
        tagOptions={tagOptions}
        disableSave={!!props.data?.recordId}
        onSave={handleSave}
        onBeforeSend={convertRequest}
        onSaveAs={() => {
          setSaveAsShow(true);
        }}
        onChange={({ title, description, tags }) => {
          if (title) {
            rename(title);
          }
          if (description) {
            FileSystemService.saveRequest(
              workspaceId,
              {
                id: data?.id,
                description,
              },
              nodeInfo?.nodeType || 1,
            );
          }
          if (tags) {
            FileSystemService.saveRequest(
              workspaceId,
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
    </>
  );
};

export default Request;
