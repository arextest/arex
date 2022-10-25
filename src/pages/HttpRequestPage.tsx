import { EditOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import {
  Badge,
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Input,
  message,
  Select,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { AnimateAutoHeight } from '../components';
import ArexRequestComponent from '../components/ArexRequestComponent/lib';
import { convertRequestData } from '../components/ArexRequestComponent/util';
import {
  FormHeader,
  FormHeaderWrapper,
  FormTable,
  Response,
  ResponseCompare,
  ResponseTest,
  SaveRequestButton,
  useColumns,
} from '../components/httpRequest';
import Mock from '../components/httpRequest/Mock';
import SmartEnvInput from '../components/smart/EnvInput';
import { Label, SpaceBetweenWrapper } from '../components/styledComponents';
import { ContentTypeEnum, MethodEnum, METHODS, NodeType } from '../constant';
import { treeFindPath } from '../helpers/collection/util';
import { readableBytes } from '../helpers/http/responseMeta';
import AgentAxios from '../helpers/request';
import { runTestScript } from '../helpers/sandbox';
import {
  generateGlobalPaneId,
  parseGlobalPaneId,
  tryParseJsonString,
  tryPrettierJsonString,
} from '../helpers/utils';
import { MenuTypeEnum } from '../menus';
import { CollectionService } from '../services/CollectionService';
import { FileSystemService } from '../services/FileSystem.service';
import { Page, useStore } from '../store';
import { PageFC, PageTypeEnum } from './index';

export enum HttpRequestMode {
  Normal = 'normal',
  Compare = 'compare',
}

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

export type ParamsObject = { [key: string]: string };

const RequestTypeOptions = METHODS.map((method) => ({
  label: method,
  value: method,
}));

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
    :hover {
      z-index: 1000;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;

const CountTag = styled(Tag)`
  border-radius: 8px;
  padding: 0 6px;
  margin-left: 4px;
`;

const ResponseWrapper = styled.div`
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BreadcrumbHeader = styled.div`
  cursor: pointer;
  display: flex;
  .tool {
    margin-left: 8px;
    visibility: hidden;
  }
  &:hover {
    .tool {
      visibility: unset;
    }
  }
`;

// 注
// mode：有两种模式，normal、compare
// id：request的id，组件加载时拉一次数据
// isNew：是否为新增的request
const HttpRequestPage: PageFC = (props) => {
  const {
    userInfo: { email: userName },
    themeClassify,
    collectionTreeData,
    extensionInstalled,
    setPages,
    currentEnvironment,
    setCollectionLastManualUpdateTimestamp,
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
          }).then((res) => {
            console.log(res);
          });
        }
      }}
      cRef={arexRequestComponentRef}
      requestExtraTabItems={[
        {
          key: '7',
          label: 'mock',
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
