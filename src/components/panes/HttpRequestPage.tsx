import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { treeFind, treeFindPath } from '../../helpers/collection/util';
import { parsePaneId } from '../../helpers/functional/url';
import { runRESTPreRequest, runRESTRequest } from '../../helpers/http/RequestRunner';
import { convertSaveRequestData } from '../../helpers/http/util';
import { useCustomNavigate } from '../../router/useCustomNavigate';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
import useUserProfile from '../../store/useUserProfile';
import Http, { HttpRef } from '../http';
import { Environment } from '../http/data/environment';
import { HoppRESTRequest } from '../http/data/rest';
import { ExtraTabs } from '../http/extra';
import { HoppRESTResponse } from '../http/helpers/types/HoppRESTResponse';
import { nodeType } from '../menus/CollectionMenu';
import SaveRequestButton from '../menus/CollectionMenu/SaveRequestButton';
import { sendQuickCompare } from './BatchComparePage/util';
import { PageFC, PagesType } from './index';

const HttpRequestPageWrapper = styled.div`
  overflow: hidden;
  height: calc(100vh - 128px);
  min-height: 650px;
  overflow-y: auto;
  border: 0 solid salmon;
  .ant-tabs-content {
    .ant-tabs-tabpane {
      padding: 0;
    }
  }
`;

const HttpRequestPage: PageFC<nodeType> = (props) => {
  const { t } = useTranslation(['components']);
  const { message } = App.useApp();
  const { workspaceId } = useParams();

  const { theme } = useUserProfile();
  const { collectionTreeData, setPages, pages, activeEnvironment } = useStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [reqParams, setReqParams] = useState<HoppRESTRequest>();
  const params = useParams();
  const customNavigate = useCustomNavigate();
  const environment = useMemo<Environment>(
    () =>
      activeEnvironment
        ? {
            name: activeEnvironment.envName,
            variables: activeEnvironment.keyValues || [],
          }
        : {
            name: '',
            variables: [],
          },
    [activeEnvironment],
  );
  const id = useMemo(() => parsePaneId(props.page.paneId)['rawId'], [props.page.paneId]);
  // TODO 删除nodeType兜底逻辑
  const nodeType = useMemo(() => {
    return (
      treeFind(collectionTreeData, (node) => node.key === parsePaneId(props.page.paneId)['rawId'])
        ?.nodeType || 1
    );
  }, [props.page.paneId, collectionTreeData]);

  const nodePath = useMemo(() => {
    const path = treeFindPath(
      collectionTreeData,
      (node: nodeType) => node.key === parsePaneId(props.page.paneId)['rawId'],
    );

    return path;
  }, [props.page.paneId, collectionTreeData]);

  const { data, run: queryInterfaceOrCase } = useRequest(
    () =>
      nodeType === 2
        ? FileSystemService.queryCase({ id, parentId: nodePath.at(-2)?.key })
        : FileSystemService.queryInterface({ id }),
    {
      refreshDeps: [id, nodeType],
    },
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
          queryInterfaceOrCase();
          httpRef.current?.forceReRendering();
        }
      },
    },
  );

  const httpConfig = useMemo(
    () => ({
      requestTabs: {
        extra: [
          {
            label: 'Mock',
            key: 'mock',
            hidden: !data?.recordId,
            children: <ExtraTabs.RequestTabs.Mock recordId={data?.recordId as string} />,
          },
          {
            label: t('http.compare_config'),
            key: 'compareConfig',
            hidden: nodeType === 2,
            children: (
              <ExtraTabs.RequestTabs.CompareConfig
                interfaceId={id}
                operationId={data?.operationId}
              />
            ),
          },
        ],
      },
      responseTabs: {
        extra: [],
      },
    }),
    [data],
  );

  const handleSave = (request: HoppRESTRequest, response?: HoppRESTResponse) => {
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
    if (nodeType === 1 && id.length === 36) {
      setReqParams(request);
      setSaveModalOpen(true);
    } else {
      FileSystemService[nodeType === 2 ? 'saveCase' : 'saveInterface'](
        convertSaveRequestData(workspaceId as string, id, request),
      ).then((success) =>
        success ? message.success('update success') : message.error('update failed'),
      );
    }
  };

  const handleSaveAs = (node: nodeType) => {
    const filteredPanes = pages.filter((i) => i.paneId !== props.page.paneId);
    setPages(filteredPanes);

    const nodeType = node.nodeType === 3 ? PagesType.Folder : PagesType.Request;
    customNavigate(
      `/${params.workspaceId}/${nodeType}/${node.key}?data=${encodeURIComponent(
        JSON.stringify(node),
      )}`,
    );
    window.globalFetchTreeData();
  };
  const httpRef = useRef<HttpRef>(null);
  return (
    <HttpRequestPageWrapper>
      <Http
        ref={httpRef}
        renderResponse
        id={id}
        // TODO 这里较复杂，待完善类型
        // @ts-ignore
        value={data}
        theme={theme}
        config={httpConfig}
        nodeType={nodeType}
        nodePath={nodePath.map((item) => item.title)}
        environment={environment}
        onPreSend={runRESTPreRequest}
        onSend={runRESTRequest}
        onSendCompare={() => {
          const nodeInfo = treeFindPath(collectionTreeData, (node) => node.key === id);
          return sendQuickCompare({
            caseId: id,
            nodeInfo,
            envs: environment.variables,
          });
        }}
        onSave={handleSave}
        onPin={runPinMock}
      />

      <SaveRequestButton
        open={saveModalOpen}
        reqParams={reqParams}
        collectionTreeData={collectionTreeData}
        onSaveAs={handleSaveAs}
        onClose={() => setSaveModalOpen(false)}
      />
    </HttpRequestPageWrapper>
  );
};

export default HttpRequestPage;
