import styled from '@emotion/styled';
import { message, Tag } from 'antd';
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ArexRequestComponent from '../components/ArexRequestComponent/lib';
import Http from '../components/ArexRequestComponent/lib';
import { convertRequestData } from '../components/ArexRequestComponent/util';
import Mock from '../components/httpRequest/Mock';
import { treeFind } from '../helpers/collection/util';
import { AgentAxiosAndTest, AgentAxiosCompare } from '../helpers/request';
import { parseGlobalPaneId } from '../helpers/utils';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import { PageFC } from './index';
// import HttpRequest from '../components/ArexRequestComponent/lib/components/http/Request';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const HttpRequestPage: PageFC = (props) => {
  const {
    userInfo: { email: userName },
    themeClassify,
    collectionTreeData,
    currentEnvironment,
  } = useStore();
  const { workspaceId } = useParams();
  const arexRequestComponentRef = useRef(null);
  const id = useMemo(() => parseGlobalPaneId(props.page.paneId)['rawId'], [props.page.paneId]);

  const nodeType = useMemo(() => {
    return (
      treeFind(
        collectionTreeData,
        (node) => node.key === parseGlobalPaneId(props.page.paneId)['rawId'],
      )?.nodeType || 1
    );
  }, [props.page.paneId]);

  console.log(id, 'id');
  return (
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
          console.log(e.payload);
          // return updateRequestById(e.payload);

          if (nodeType === 1) {
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
      cRef={arexRequestComponentRef}
      requestExtraTabItems={[
        {
          key: '7',
          label: 'Mock',
          children: <div>mock</div>,
          field: 'mock',
          data: {
            mock: 'mock',
          },
        },
      ]}
    />
  );
};

export default HttpRequestPage;
