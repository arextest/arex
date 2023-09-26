import { ArexPaneFC, getLocalStorage, useTranslation } from '@arextest/arex-core';
import { ArexEnvironment, ArexRequest, ArexRequestProps } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { EMAIL_KEY, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import { useNavPane } from '@/hooks';
import { EnvironmentService, FileSystemService, ReportService } from '@/services';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import EnvironmentDrawer, {
  EnvironmentDrawerRef,
  WorkspaceEnvironmentPair,
} from './EnvironmentDrawer';
import { ExtraTabs } from './extra';
import SaveAs, { SaveAsRef } from './SaveAs';
import { convertRequest, updateWorkspaceEnvironmentLS } from './utils';

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
        if (initialEnvId) {
          const env = res.find((env) => env.id === initialEnvId);
          setActiveEnvironment(env);
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
        path: [], // TODO: get nodePathId from details
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
          environmentDrawerRef?.current?.open({
            name: envName,
            id: environmentId,
            variables: [],
          });
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

  return (
    <>
      <ArexRequest
        ref={httpRef}
        loading={!data}
        height='calc(100vh - 110px)'
        data={data}
        config={httpConfig}
        environmentProps={{
          environmentId: activeEnvironment?.id,
          environments: environments,
          onChange: handleEnvironmentChange,
          onAdd: createNewEnvironment,
          onEdit: environmentDrawerRef?.current?.open,
        }}
        // breadcrumbItems={nodePath} // TODO: get nodePathName from details
        description={data?.description}
        tags={data?.tags}
        tagOptions={tagOptions}
        disableSave={!!props.data?.recordId}
        onSave={handleSave}
        onBeforeSend={convertRequest}
        onSaveAs={saveAsRef?.current?.open}
        onTitleChange={rename}
        onDescriptionChange={(description) =>
          saveRequest({
            id: data?.id,
            description,
          })
        }
        onTagsChange={(tags) =>
          saveRequest({
            id: data?.id,
            tags,
          })
        }
      />

      <SaveAs ref={saveAsRef} workspaceId={workspaceId} />

      <EnvironmentDrawer
        ref={environmentDrawerRef}
        workspaceId={workspaceId}
        onUpdate={refreshEnvironments}
      />
    </>
  );
};

export default Request;
