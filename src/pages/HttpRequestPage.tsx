import styled from '@emotion/styled';
import { message, Tag } from 'antd';
import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ArexRequestComponent from '../components/ArexRequestComponent/lib';
import { convertRequestData } from '../components/ArexRequestComponent/util';
import Mock from '../components/httpRequest/Mock';
import { parseGlobalPaneId } from '../helpers/utils';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import { PageFC } from './index';

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
  } = useStore();
  const { workspaceId } = useParams();
  const arexRequestComponentRef = useRef(null);
  const id = useMemo(() => parseGlobalPaneId(props.page.paneId)['rawId'], [props.page.paneId]);

  console.log(id, 'id');
  return (
    <ArexRequestComponent
      locale={'en'}
      theme={themeClassify}
      currentRequestId={id}
      collectionTreeData={collectionTreeData}
      envData={[]}
      currentEnvId={'aa'}
      onEdit={(e) => {
        if (e.type === 'retrieve') {
          return FileSystemService.queryInterface({ id: e.payload.requestId }).then((res) =>
            convertRequestData(res),
          );
        } else if (e.type === 'update') {
          console.log(e.payload);
          // return updateRequestById(e.payload);
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
          }).then((res) => {
            if (res.body.success) {
              message.success('success');
            }
          });
        }
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
