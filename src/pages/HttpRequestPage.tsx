import { css } from '@emotion/react';
import { message } from 'antd';
import Http from 'arex-request';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { convertRequestData } from '../components/ArexRequestComponent/util';
import { treeFind } from '../helpers/collection/util';
import { AgentAxiosAndTest, AgentAxiosCompare } from '../helpers/request';
import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { MenusType } from '../menus';
import SaveRequestButton from '../menus/CollectionMenu/SaveRequestButton';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import request from './../helpers/api/axios';
import { PageFC, PagesType } from './index';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const HttpRequestPage: PageFC = (props) => {
  const { collectionTreeData, setPages, pages } = useStore();
  const { workspaceId } = useParams();

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
  }, [props.page.paneId]);

  return (
    <div
      css={css`
        overflow: hidden;
      `}
    >
      <div
        css={css`
          width: calc(100% + 32px);
          border: 0px solid salmon;
          transform: translateX(-16px);
        `}
      >
        <Http
          currentRequestId={id}
          onEdit={(e) => {
            if (e.type === 'retrieve') {
              if (nodeType === 1) {
                return FileSystemService.queryInterface({ id: e.payload.requestId }).then((res) =>
                  convertRequestData(res, 'address'),
                );
              } else if (nodeType === 2) {
                return FileSystemService.queryCase({ id: e.payload.requestId }).then((res) =>
                  convertRequestData(res, 'address'),
                );
              }
            } else if (e.type === 'update') {
              if (nodeType === 1 && id.length === 36) {
                setReqParams(e.payload);
                saveRequestButtonRef.current.open();
              } else if (nodeType === 1) {
                FileSystemService.saveInterface({
                  workspaceId: workspaceId,
                  id: id,
                  address: {
                    endpoint: e.payload.endpoint,
                    method: e.payload.method,
                  },
                  body: e.payload.body,
                  headers: e.payload.headers,
                  params: e.payload.params,
                  testScript: e.payload.testScript,
                  testAddress: {
                    endpoint: e.payload.compareEndpoint,
                    method: e.payload.compareMethod,
                  },
                }).then((res) => {
                  if (res.body.success) {
                    message.success('success');
                  }
                });
              } else if (nodeType === 2) {
                FileSystemService.saveCase({
                  workspaceId: workspaceId,
                  id: id,
                  address: {
                    endpoint: e.payload.endpoint,
                    method: e.payload.method,
                  },
                  body: e.payload.body,
                  headers: e.payload.headers,
                  params: e.payload.params,
                  testScript: e.payload.testScript,
                  testAddress: {
                    endpoint: e.payload.compareEndpoint,
                    method: e.payload.compareMethod,
                  },
                }).then((res) => {
                  if (res.body.success) {
                    message.success('success');
                  }
                });
              }
            }
          }}
          onSend={(e) => {
            return AgentAxiosAndTest(e);
          }}
          onSendCompare={(e) => {
            return AgentAxiosCompare(e);
          }}
          requestAxios={request}
        />
        <SaveRequestButton
          reqParams={reqParams}
          collectionTreeData={collectionTreeData}
          onSaveAs={(node) => {
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
          }}
          ref={saveRequestButtonRef}
        />
      </div>
    </div>
  );
};

export default HttpRequestPage;
