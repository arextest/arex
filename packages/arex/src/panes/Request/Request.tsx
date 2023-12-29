import { ArexPaneFC, getLocalStorage, i18n, useTranslation } from '@arextest/arex-core';
import { ArexEnvironment, ArexRequest, ArexRequestProps } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { EMAIL_KEY, PanesType, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { EnvironmentService, FileSystemService, ReportService } from '@/services';
import { Environment } from '@/services/EnvironmentService/getEnvironments';
import { useCollections, useWorkspaces } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import EnvironmentDrawer, {
  EnvironmentDrawerRef,
  WorkspaceEnvironmentPair,
} from './EnvironmentDrawer';
import { ExtraTabs } from './extra';
import SaveAs, { SaveAsRef } from './SaveAs';
import { updateWorkspaceEnvironmentLS } from './utils';

export type RequestProps = {
  recordId?: string;
  planId?: string;
  environmentId?: string;
};

const Request: ArexPaneFC<RequestProps> = (props) => {
  const { t } = useTranslation();
  const navPane = useNavPane({ inherit: true });
  const { message } = App.useApp();

  const { getCollections } = useCollections();
  const userName = getLocalStorage<string>(EMAIL_KEY);
  const { id: paneId, type } = decodePaneKey(props.paneKey);
  // requestId structure: workspaceId-nodeTypeStr-id
  const [workspaceId, nodeTypeStr, id] = useMemo(() => paneId.split('-'), [paneId]);
  const { workspaces } = useWorkspaces();
  const nodeType = useMemo(() => parseInt(nodeTypeStr), [nodeTypeStr]);

  const httpRef = useRef(null);
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
    (params, needRefresh?: boolean) => FileSystemService.saveRequest(workspaceId, params, nodeType),
    {
      manual: true,
      onSuccess(res, [params, needRefresh]) {
        res && message.success('保存成功');
        needRefresh && getCollections();
        navPane({
          id: paneId,
          type,
          icon: params?.method,
        });
      },
    },
  );

  const handleSave: ArexRequestProps['onSave'] = (request, response) => {
    if (
      !request?.headers.find((header) => header.key === 'arex-record-id') &&
      (response?.type === 'success' ? response.headers : []).find(
        (header) => header.key === 'arex-record-id',
      ) &&
      request?.headers.find((header) => header.key === 'arex-force-record')?.active
    ) {
      const recordId =
        response?.type === 'success'
          ? response.headers.find((header) => header.key === 'arex-record-id')?.value
          : '';

      runPinMock(recordId);
    }
    saveRequest(request, true);
  };

  const { data, run } = useRequest(() =>
    FileSystemService.queryRequest({
      id,
      nodeType,
      recordId: props.data?.recordId,
      planId: props.data?.planId,
    }),
  );

  const parentPath = useMemo(() => data?.parentPath?.map((path) => path.name), [data]);

  const { run: runPinMock } = useRequest(
    (recordId) =>
      FileSystemService.pinMock({
        workspaceId: workspaceId as string,
        infoId: id,
        recordId,
        nodeType,
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
        path: data!.parentPath!.map((path) => path.id).concat(data!.id),
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
            hidden: !(data?.recordId || props.data?.recordId),
            children: (
              <ExtraTabs.RequestTabs.Mock recordId={data?.recordId || props.data?.recordId} />
            ),
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

  return (
    <>
      <ArexRequest
        ref={httpRef}
        loading={!data}
        data={data}
        language={i18n.language}
        config={httpConfig}
        breadcrumb={parentPath}
        titleProps={{
          value: data?.name,
          onChange: rename,
        }}
        labelsProps={{
          value: data?.tags,
          options: tagOptions,
          onChange: (tags) => {
            console.log({ tags });
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
        disableSave={!!props.data?.recordId}
        onSave={handleSave}
        // onSaveAs={saveAsRef?.current?.open}
      />

      <SaveAs ref={saveAsRef} workspaceId={workspaceId} />

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
