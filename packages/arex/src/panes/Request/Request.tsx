import { ArexPaneFC, getLocalStorage, i18n, useTranslation } from '@arextest/arex-core';
import {
  ArexEnvironment,
  ArexRequest,
  ArexRequestProps,
  ArexRequestRef,
} from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import {
  CollectionNodeType,
  EMAIL_KEY,
  PanesType,
  WORKSPACE_ENVIRONMENT_PAIR_KEY,
} from '@/constant';
import { useNavPane } from '@/hooks';
import { EnvironmentService, FileSystemService, ReportService } from '@/services';
import { Environment } from '@/services/EnvironmentService/getEnvironments';
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

  const { collectionsTreeData, getCollections, getPath } = useCollections();
  const { removePane } = useMenusPanes();

  const userName = getLocalStorage<string>(EMAIL_KEY);
  const { id: paneId, type } = decodePaneKey(props.paneKey);
  // requestId structure: workspaceId-nodeTypeStr-id
  const [workspaceId, nodeTypeStr, id] = useMemo(() => paneId.split('-'), [paneId]);
  const { workspaces } = useWorkspaces();
  const nodeType = useMemo(() => parseInt(nodeTypeStr), [nodeTypeStr]);

  const requestRef = useRef<ArexRequestRef>(null);
  const saveAsRef = useRef<SaveAsRef>(null);
  const environmentDrawerRef = useRef<EnvironmentDrawerRef>(null);

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

        options?.pinMock && runPinMock(options?.pinMock);
        reloadCollection(params.id);
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

    // case debug save runPinMock
    if (props.data?.recordId && request.id && request.id !== id) {
      pinMock = { infoId: request.id, recordId: props.data.recordId };
    }

    // force record runPinMock
    const forceRecord = request?.headers.find(
      (header) => header.key === 'arex-force-record',
    )?.active;
    const recordId = response?.headers?.find((header) => header.key === 'arex-record-id')?.value;
    if (forceRecord && recordId) {
      pinMock = { infoId: request.id, recordId };
    }
    saveRequest(request, { pinMock });
  };

  const { data, loading, run } = useRequest(
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

  const parentPath = useMemo(() => getPath(id), [collectionsTreeData]);

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
      onSuccess: (success, [{ infoId }]) => {
        if (success) {
          reloadCollection(infoId);
        }
      },
    },
  );
  const { run: rename } = useRequest(
    (newName) =>
      FileSystemService.renameCollectionItem({
        id: workspaceId,
        newName,
        path: parentPath.map((path) => path.id),
        userName: userName as string,
      }),
    {
      manual: true,
      ready: !!data,
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
            // 这里判断是否有recordId，如果有则隐藏，因为recordId是mock的唯一标识
            hidden: !data?.recordId,
            children: <ExtraTabs.RequestTabs.Mock recordId={data?.recordId} />,
          },
        ],
      },
      responseTabs: {
        extra: [],
      },
    };
  }, [data]);

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

  const reloadCollection = (infoId: string) => {
    getCollections().then(() => {
      navPane({
        id: `${workspaceId}-${nodeType}-${infoId}`,
        type,
        icon: 'arex',
      });
      if (infoId !== id) removePane(props.paneKey); // remove old pane when save as
      else run();
    });
  };

  return (
    <>
      <ArexRequest
        ref={requestRef}
        loading={loading}
        data={data}
        language={i18n.language}
        config={httpConfig}
        breadcrumb={parentPath?.length ? parentPath.map((path) => path.name) : [title]}
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
        onSaveAs={() => saveAsRef?.current?.open(title)}
      />

      <SaveAs
        ref={saveAsRef}
        title={title}
        nodeType={nodeType}
        workspaceId={workspaceId}
        // debug case save params
        appName={decodeURIComponent(props.data?.appName || '')}
        interfaceName={decodeURIComponent(props.data?.interfaceName || '')}
        operationId={decodeURIComponent(props.data?.operationId || '')}
        recordId={decodeURIComponent(props.data?.recordId || '')}
        onCreate={requestRef.current?.save}
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
