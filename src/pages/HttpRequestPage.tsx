import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Http from '../components/arex-request';
import { Environment } from '../components/arex-request/data/environment';
import { HoppRESTRequest } from '../components/arex-request/data/rest';
import { ExtraTabs } from '../components/arex-request/extra';
import { treeFind, treeFindPath } from '../helpers/collection/util';
import { runCompareRESTRequest } from '../helpers/CompareRequestRunner';
import { convertSaveRequestData } from '../helpers/http/util';
import { runRESTRequest } from '../helpers/RequestRunner';
import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { MenusType } from '../menus';
import { nodeType } from '../menus/CollectionMenu';
import SaveRequestButton from '../menus/CollectionMenu/SaveRequestButton';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import useUserProfile from '../store/useUserProfile';
import { PageFC, PagesType } from './index';

const HttpRequestPageWrapper = styled.div`
  overflow: hidden;
  height: calc(100vh - 128px);
  min-height: 650px;
  overflow-y: auto;
  border: 0 solid salmon;
  margin-left: -16px;
  width: calc(100% + 32px);
  .ant-tabs-content {
    .ant-tabs-tabpane {
      padding: 0;
    }
  }
`;

const HttpRequestPage: PageFC<nodeType> = (props) => {
  const { message } = App.useApp();
  const { workspaceId } = useParams();

  const { theme } = useUserProfile();
  const { collectionTreeData, setPages, pages, activeEnvironment } = useStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [reqParams, setReqParams] = useState<HoppRESTRequest>();

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
  const id = useMemo(() => parseGlobalPaneId(props.page.paneId)['rawId'], [props.page.paneId]);

  const nodeType = useMemo(() => {
    return (
      treeFind(
        collectionTreeData,
        (node) => node.key === parseGlobalPaneId(props.page.paneId)['rawId'],
      )?.nodeType || 1
    );
  }, [props.page.paneId, collectionTreeData]);

  const nodePath = useMemo(() => {
    const path = treeFindPath(
      collectionTreeData,
      (node: nodeType) => node.key === parseGlobalPaneId(props.page.paneId)['rawId'],
    );

    return path.map((item) => item.title);
  }, [props.page.paneId, collectionTreeData]);

  const { data, run: queryInterfaceOrCase } = useRequest(
    () =>
      nodeType === 2
        ? FileSystemService.queryCase({ id })
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
          // {
          //   label: 'CompareConfig',
          //   key: 'compareConfig',
          //   hidden: nodeType === 2,
          //   children: (
          //     <ExtraTabs.RequestTabs.CompareConfig
          //       interfaceId={id}
          //       operationId={data?.operationId}
          //     />
          //   ),
          // },
        ],
      },
      responseTabs: {
        extra: [],
      },
    }),
    [data],
  );

  const handleSave = (request: HoppRESTRequest) => {
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
    setPages(
      {
        title: node.title,
        menuType: MenusType.Collection,
        pageType: node.nodeType === 3 ? PagesType.Folder : PagesType.Request,
        isNew: false,
        data: node,
        paneId: generateGlobalPaneId(
          MenusType.Collection,
          node.nodeType === 3 ? PagesType.Folder : PagesType.Request,
          node.key,
        ),
        rawId: node.key,
      },
      'push',
    );
    window.globalFetchTreeData();
  };
  return (
    <HttpRequestPageWrapper>
      <Http
        renderResponse
        id={id}
        value={data}
        theme={theme}
        config={httpConfig}
        nodeType={nodeType}
        nodePath={nodePath}
        environment={environment}
        onSend={runRESTRequest}
        onSendCompare={runCompareRESTRequest}
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
