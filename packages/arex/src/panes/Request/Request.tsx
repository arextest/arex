import {
  ArexPaneFC,
  getLocalStorage,
  i18n,
  RequestMethodEnum,
  SmallBadge,
  useTranslation,
} from '@arextest/arex-core';
import {
  ArexEnvironment,
  ArexRequest,
  ArexRequestProps,
  ArexRequestRef,
  ArexRESTHeader,
} from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { CollectionNodeType, PanesType, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { EnvironmentService, FileSystemService, ReportService, StorageService } from '@/services';
import { Environment } from '@/services/EnvironmentService/getEnvironments';
import { GetCollectionItemTreeReq } from '@/services/FileSystemService';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import EnvironmentDrawer, {
  EnvironmentDrawerRef,
  WorkspaceEnvironmentPair,
} from './EnvironmentDrawer';
import { ExtraTabs } from './extra';
import SaveAs, { SaveAsRef } from './SaveAs';
import { updateWorkspaceEnvironmentLS } from './utils';

export type RequestProps = {
  environmentId?: string;
  // case save
  planId?: string;
  recordId?: string;
  appName?: string;
  interfaceName?: string;
  operationId?: string;
};

const Request: ArexPaneFC<RequestProps> = (props) => {
  const { t } = useTranslation();
  const navPane = useNavPane({ inherit: true });
  const { message } = App.useApp();

  const { renameCollectionNode, setMethodByPath } = useCollections();
  const { removePane } = useMenusPanes();

  const { id: paneId, type } = decodePaneKey(props.paneKey);
  // requestId structure: workspaceId-nodeTypeStr-id
  const [workspaceId, nodeTypeStr, id] = useMemo(() => paneId.split('-'), [paneId]);
  const { workspaces } = useWorkspaces();
  const nodeType = useMemo(() => parseInt(nodeTypeStr), [nodeTypeStr]);

  const requestRef = useRef<ArexRequestRef>(null);
  const saveAsRef = useRef<SaveAsRef>(null);
  const environmentDrawerRef = useRef<EnvironmentDrawerRef>(null);

  const [enableCompare, setEnableCompare] = useState(false);

  const [activeEnvironment, setActiveEnvironment] = useState<ArexEnvironment>();
  const [compareDiffCount, setCompareDiffCount] = useState(0);

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

  const { data: environments, refresh: refreshEnvironments } = useRequest(
    EnvironmentService.getEnvironments,
    {
      defaultParams: [{ workspaceId }],
      onSuccess(res) {
        const workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
          WORKSPACE_ENVIRONMENT_PAIR_KEY,
        );
        const initialEnvId = props.data?.environmentId || workspaceEnvironmentPair?.[workspaceId];
        if (!activeEnvironment && initialEnvId) {
          const env = res.find((env) => env.id === initialEnvId);
          handleEnvironmentChange(env);
        }
      },
    },
  );

  const { run: saveRequest } = useRequest(
    (
      params,
      options?: {
        pinMock?: { infoId: string; recordId: string };
      },
    ) =>
      FileSystemService.saveRequest(
        workspaceId,
        {
          ...params,
          description: params.description || data?.description,
          tags: params.tags || data?.tags,
        },
        nodeType,
      ),
    {
      manual: true,
      onSuccess(res, [params, options]) {
        res && message.success(t('message.saveSuccess', { ns: 'common' }));
        if (options?.pinMock) runPinMock(options.pinMock);
        else if (params.id && params.nodeType)
          reloadCollection({
            workspaceId,
            infoId: params.id,
            nodeType: params.nodeType,
            method: params.method,
          });
      },
    },
  );

  const handleSave: ArexRequestProps['onSave'] = (request, response) => {
    if (request?.id?.length !== 24)
      return saveAsRef?.current?.open(
        title,
        props.data?.recordId ? { defaultPath: !!props.data?.recordId } : undefined,
      );

    if (!request.id) return;

    let pinMock = undefined;

    // @ts-ignore
    const responseRecordId = response?.headers?.find(
      (header: ArexRESTHeader) => header.key === 'arex-record-id',
    )?.value;
    // case debug save runPinMock
    if (request.id && (props.data?.recordId || responseRecordId)) {
      pinMock = {
        infoId: request.id,
        recordId: (responseRecordId || props.data.recordId) as string,
      };
    }

    saveRequest(request, { pinMock });
  };

  const {
    data,
    loading,
    run: queryRequest,
  } = useRequest(
    () =>
      FileSystemService.queryRequest({
        id,
        nodeType,
        recordId: props.data?.recordId,
        planId: props.data?.planId,
      }),
    {
      onError(error) {
        message.error(error.toString());
      },
    },
  );
  const title = useMemo(
    () => data?.name || decodeURIComponent(props.data?.recordId || t('untitled', { ns: 'common' })),
    [data?.name, props.data?.recordId, t],
  );

  const { data: pathInfo = [], refresh: refreshRequestName } = useRequest(
    FileSystemService.queryPathInfo,
    {
      defaultParams: [{ infoId: id, nodeType }],
    },
  );

  const path = useMemo(() => pathInfo.map((path) => path.id), [pathInfo]);

  const { run: runPinMock } = useRequest(
    ({ infoId, recordId }: { infoId: string; recordId: string }) =>
      FileSystemService.pinMock({
        workspaceId,
        infoId,
        recordId,
        nodeType: CollectionNodeType.case,
      }),
    {
      manual: true,
      ready: !!workspaceId,
      onSuccess: (success, [{ infoId, recordId }]) => {
        if (success) {
          reloadCollection({ workspaceId, infoId, nodeType: CollectionNodeType.case });
        }
      },
    },
  );
  const { run: rename } = useRequest(
    (newName) =>
      FileSystemService.renameCollectionItem({
        id: workspaceId,
        newName,
        path,
      }),
    {
      manual: true,
      ready: !!data,
      onSuccess(success, [name]) {
        if (success) {
          renameCollectionNode(
            pathInfo.map((path) => path.id),
            name,
          );
          refreshRequestName();
          navPane({
            id: paneId,
            type,
            name,
          });
        }
      },
    },
  );

  const {
    data: mockData = [],
    mutate: setMockData,
    refresh: getMockData,
    loading: loadingMockData,
  } = useRequest(StorageService.queryRecord, {
    defaultParams: [
      {
        recordId: (data?.recordId || props.data?.recordId) as string,
        sourceProvider: data?.recordId ? 'Pinned' : 'Rolling',
      },
    ],
    ready: !!data?.recordId || !!props.data?.recordId,
  });

  const httpConfig = useMemo(() => {
    return {
      requestTabs: {
        extra: [
          {
            key: 'mock',
            label: 'Mock',
            hidden: !data?.recordId && !props.data?.recordId,
            children: (
              <ExtraTabs.RequestTabs.Mock
                data={mockData}
                readOnly={!data?.recordId} // debug case 的 mock 为只读
                loading={loadingMockData}
                onChange={setMockData}
                onRefresh={getMockData}
              />
            ),
          },
        ],
      },
      responseTabs: {
        extra: [
          {
            key: 'compare',
            label: <SmallBadge dot={!!compareDiffCount}>{t('components:http.compare')}</SmallBadge>,
            hidden: !enableCompare,
            forceRender: true,
            children: (
              <ExtraTabs.ResponseTabs.Compare
                getResponse={requestRef.current?.getResponse}
                entryMock={
                  mockData.find((mock) => mock.categoryType.entryPoint) // get entryPoint mock
                }
                onGetDiff={(diffs) => setCompareDiffCount(diffs.length)}
              />
            ),
          },
        ],
      },
    };
  }, [data, mockData, loadingMockData, enableCompare, compareDiffCount]);

  const { run: createNewEnvironment } = useRequest(
    (envName) =>
      EnvironmentService.saveEnvironment({
        env: {
          envName,
          workspaceId,
          keyValues: [],
        },
      }),
    {
      manual: true,
      onSuccess({ success, environmentId }, [envName]) {
        if (success) {
          const newEnv = {
            name: envName,
            id: environmentId,
            variables: [],
          };
          handleEnvironmentChange(newEnv);
          environmentDrawerRef?.current?.open(newEnv);
          refreshEnvironments();
        } else {
          message.error(t('message.createFailed', { ns: 'common' }));
        }
      },
    },
  );

  const handleEnvironmentChange = (environment?: ArexEnvironment) => {
    navPane({
      id: paneId,
      type,
      data: {
        ...props.data,
        environmentId: environment?.id,
      },
    });
    setActiveEnvironment(environment);
    environment && updateWorkspaceEnvironmentLS(workspaceId, environment.id);
  };

  const handleDuplicateEnvironment = (environment: Environment) => {
    refreshEnvironments();
    const env: ArexEnvironment = {
      id: environment.id,
      name: environment.envName,
      variables: environment.keyValues,
    };
    handleEnvironmentChange(env);
    environmentDrawerRef?.current?.open(env);
  };

  const handleDeleteEnvironment = () => {
    handleEnvironmentChange(undefined);
    refreshEnvironments();
  };

  const reloadCollection = (params: GetCollectionItemTreeReq & { method?: string }) => {
    const methodChanged = data?.method !== params.method;
    methodChanged && setMethodByPath(path, params.method as RequestMethodEnum);

    navPane({
      id: `${workspaceId}-${nodeType}-${params.infoId}`,
      type,
      icon: params.method,
    });
    if (params.infoId !== id) removePane(props.paneKey); // remove old pane when save as
    else queryRequest();
  };

  const { data: aiFeatureCheck } = useRequest(() => ReportService.aiEnabled());

  return (
    <>
      <ArexRequest
        ref={requestRef}
        loading={loading}
        data={data}
        language={i18n.language}
        config={httpConfig}
        ai={
          aiFeatureCheck?.aiEnabled
            ? {
                gptProvider: ReportService.generateTestScripts,
                modelInfos: aiFeatureCheck?.modelInfos ?? [],
              }
            : undefined
        }
        breadcrumb={pathInfo?.length ? pathInfo.map((path) => path.name) : [title]}
        titleProps={{
          value: title,
          onChange: rename,
        }}
        labelsProps={{
          value: data?.tags,
          options: tagOptions,
          onChange: (tags) => {
            saveRequest({
              id: data?.id,
              tags,
            });
          },
          onEditLabels: () => {
            navPane({
              type: PanesType.WORKSPACE,
              id: workspaceId,
              name:
                workspaces.find((workspace) => workspace.id === workspaceId)?.workspaceName ||
                workspaceId,
              data: {
                key: 'labels',
              },
            });
          },
        }}
        descriptionProps={{
          value: data?.description,
          onChange: (description) =>
            saveRequest({
              id: data?.id,
              description,
            }),
        }}
        environmentProps={{
          value: activeEnvironment?.id,
          options: environments,
          onChange: handleEnvironmentChange,
          onAdd: createNewEnvironment,
          onEdit: environmentDrawerRef?.current?.open,
        }}
        onSave={handleSave}
        onRequest={(error, reqData, resData) => {
          setEnableCompare(!!resData?.arexConfig?.compare);
        }}
        onSaveAs={() => saveAsRef?.current?.open(title)}
      />

      <SaveAs
        ref={saveAsRef}
        title={title}
        nodeType={nodeType}
        workspaceId={workspaceId}
        pathInfo={pathInfo}
        data={data}
        // debug case save params
        appName={decodeURIComponent(props.data?.appName || '')}
        interfaceName={decodeURIComponent(props.data?.interfaceName || '')}
        operationId={decodeURIComponent(props.data?.operationId || '')}
        recordId={decodeURIComponent(props.data?.recordId || '')}
        onCreate={(id) => requestRef.current?.save(id)}
      />

      <EnvironmentDrawer
        ref={environmentDrawerRef}
        workspaceId={workspaceId}
        onUpdate={refreshEnvironments}
        onDuplicate={handleDuplicateEnvironment}
        onDelete={handleDeleteEnvironment}
      />
    </>
  );
};

export default Request;
