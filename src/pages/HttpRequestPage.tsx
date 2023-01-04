import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Http, { HttpImperativeHandle } from '../components/arex-request';
import { HoppRESTRequest } from '../components/arex-request/data/rest';
import ExtraRequestTabItemMock from '../components/arex-request/extra/ExtraRequestTabItemMock';
import HttpBreadcrumb from '../components/arex-request/extra/HttpBreadcrumb';
import request from '../helpers/api/axios';
import { treeFind, treeFindPath } from '../helpers/collection/util';
import { runCompareRESTRequest } from '../helpers/CompareRequestRunner';
import { convertRequestData, convertSaveRequestData } from '../helpers/http/util';
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

  const httpImperativeRef = useRef<HttpImperativeHandle>();

  const env = useMemo(() => {
    if (activeEnvironment) {
      return {
        name: activeEnvironment.envName,
        variables: activeEnvironment.keyValues || [],
      };
    } else {
      return {
        name: undefined,
        variables: [],
      };
    }
  }, [activeEnvironment]);
  const id = useMemo(() => parseGlobalPaneId(props.page.paneId)['rawId'], [props.page.paneId]);

  const [reqParams, setReqParams] = useState({});
  const saveRequestButtonRef = useRef(null);

  const nodeType = useMemo(() => {
    return (
      treeFind(
        collectionTreeData,
        (node) => node.key === parseGlobalPaneId(props.page.paneId)['rawId'],
      )?.nodeType || 1
    );
  }, [props.page.paneId, collectionTreeData]);

  const nodePaths = useMemo(() => {
    return treeFindPath(
      collectionTreeData,
      (node: any) => node.key === parseGlobalPaneId(props.page.paneId)['rawId'],
    );
  }, [props.page.paneId, collectionTreeData]);

  const { data, run } = useRequest(
    () => {
      if (nodeType === 2) {
        return FileSystemService.queryCase({ id }).then((r) => convertRequestData(r, 'address'));
      } else {
        return FileSystemService.queryInterface({ id }).then((r) =>
          convertRequestData(r, 'address'),
        );
      }
    },
    {
      refreshDeps: [nodeType],
    },
  );

  const { run: runPinMock } = useRequest(
    (p) =>
      request.post('/api/filesystem/pinMock', {
        workspaceId: workspaceId,
        infoId: id,
        recordId: p.recordId,
        nodeType: nodeType,
      }),
    {
      manual: true,
      onSuccess: (r) => {
        if (r.body.success) {
          message.success('pin success');
          run();
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
            children: <ExtraRequestTabItemMock recordId={data?.recordId} />,
            hidden: !data?.recordId,
          },
        ],
      },
      responseTabs: {
        extra: [],
      },
    }),
    [data],
  );

  const handleSave = (r: HoppRESTRequest) => {
    if (nodeType === 1 && id.length === 36) {
      setReqParams(r);
      saveRequestButtonRef.current.open();
    } else if (nodeType === 2) {
      FileSystemService.saveCase(convertSaveRequestData(workspaceId as string, id, r)).then(
        (res) => {
          if (res.body.success) {
            message.success('success');
          } else {
            // @ts-ignore
            message.error(res.responseStatusType.responseDesc);
          }
        },
      );
    } else {
      FileSystemService.saveInterface(convertSaveRequestData(workspaceId as string, id, r)).then(
        (res) => {
          if (res.body.success) {
            message.success('success');
          } else {
            // @ts-ignore
            message.error(res.responseStatusType.responseDesc);
          }
        },
      );
    }
  };

  const handleSaveAs = (node) => {
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
        renderResponse={true}
        ref={httpImperativeRef}
        value={data}
        environment={env}
        theme={theme}
        breadcrumb={
          <HttpBreadcrumb
            nodePaths={nodePaths}
            id={id}
            defaultTags={data?.labelIds}
            nodeType={nodeType}
          />
        }
        config={httpConfig}
        onSend={(r) => {
          return runRESTRequest({ request: r });
        }}
        onSendCompare={(r) => {
          return runCompareRESTRequest({ request: r });
        }}
        onSave={handleSave}
        onPin={(recordId) => {
          runPinMock({ recordId });
        }}
      />

      <SaveRequestButton
        reqParams={reqParams}
        collectionTreeData={collectionTreeData}
        onSaveAs={handleSaveAs}
        ref={saveRequestButtonRef}
      />
    </HttpRequestPageWrapper>
  );
};

export default HttpRequestPage;
