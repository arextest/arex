import React, { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Http from '../components/arex-request';
import {
  convertRequestData,
  convertSaveRequestData,
} from '../components/ArexRequestComponent/util';
import { treeFind } from '../helpers/collection/util';
import { AgentAxiosAndTest } from '../helpers/request';
import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { MenusType } from '../menus';
import SaveRequestButton from '../menus/CollectionMenu/SaveRequestButton';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import useUserProfile from '../store/useUserProfile';
import request from './../helpers/api/axios';
import { PageFC, PagesType } from './index';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const HttpRequestPage: PageFC = (props) => {
  const { collectionTreeData, setPages, pages, activeEnvironment } = useStore();
  // const {} = useUserProfile()
  const { workspaceId } = useParams();
  const { darkMode, theme } = useUserProfile();
  const env = useMemo(() => {
    if (activeEnvironment) {
      return {
        name: activeEnvironment.envName,
        variables: activeEnvironment.keyValues,
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

  const { data } = useRequest(
    () =>
      FileSystemService.queryInterface({ id: id }).then((r) => convertRequestData(r, 'address')),
    {},
  );
  return (
    <div
      css={css`
        overflow: hidden;
      `}
    >
      <div
        css={css`
          height: calc(100vh - 128px);
          border: 0px solid salmon;
          transform: translateX(-16px);
          width: calc(100% + 32px);
          .ant-tabs-content {
            .ant-tabs-tabpane {
              padding: 0 0px;
            }
          }
        `}
      >
        <Http
          value={data}
          environment={{ name: '', variables: [] }}
          theme={theme}
          breadcrumb={<div>breadcrumb</div>}
          config={{
            tabs: {
              extra: [
                {
                  label: 'Json verify',
                  key: 'jsonVerify',
                  children: <div>jsonVerify</div>,
                },
              ],
            },
          }}
          onSend={(r) => {
            return AgentAxiosAndTest({ request: r });
          }}
          onSave={(r) => {
            FileSystemService.saveInterface(convertSaveRequestData(id, r)).then((res) => {
              message.success(JSON.stringify(res));
            });
          }}
        />
        <SaveRequestButton
          // @ts-ignore
          reqParams={reqParams}
          collectionTreeData={collectionTreeData}
          // @ts-ignore
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
