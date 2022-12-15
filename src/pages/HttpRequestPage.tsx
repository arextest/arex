import React, { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Http, { HttpImperativeHandle } from '../components/arex-request';
import ExtraRequestTabItemCompare from '../components/arex-request/extra/ExtraRequestTabItemCompare';
import ExtraRequestTabItemMock from '../components/arex-request/extra/ExtraRequestTabItemMock';
import HttpBreadcrumb from '../components/arex-request/extra/HttpBreadcrumb';
import { treeFind, treeFindPath } from '../helpers/collection/util';
import { convertRequestData, convertSaveRequestData } from '../helpers/http/util';
import { runRESTRequest } from '../helpers/RequestRunner';
import { generateGlobalPaneId, parseGlobalPaneId } from '../helpers/utils';
import { MenusType } from '../menus';
import { nodeType } from '../menus/CollectionMenu';
import SaveRequestButton from '../menus/CollectionMenu/SaveRequestButton';
import { NodeType } from '../services/CollectionService.type';
import { FileSystemService } from '../services/FileSystem.service';
import { useStore } from '../store';
import useUserProfile from '../store/useUserProfile';
import { PageFC, PagesType } from './index';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const HttpRequestPage: PageFC<nodeType> = (props) => {
  const { collectionTreeData, setPages, pages, activeEnvironment } = useStore();
  const { workspaceId } = useParams();
  const { theme } = useUserProfile();
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

  const { data } = useRequest(
    () => {
      if (nodeType === 2) {
        return FileSystemService.queryCase({ id: id }).then((r) =>
          convertRequestData(r, 'address'),
        );
      } else {
        return FileSystemService.queryInterface({ id: id }).then((r) =>
          convertRequestData(r, 'address'),
        );
      }
    },
    {
      refreshDeps: [nodeType],
    },
  );

  const httpImperativeRef = useRef<HttpImperativeHandle>();
  console.log(httpImperativeRef.current?.getRequestValue());
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
          margin-left: -16px;
          width: calc(100% + 32px);
          .ant-tabs-content {
            .ant-tabs-tabpane {
              padding: 0 0px;
            }
          }
        `}
      >
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
          config={{
            tabs: {
              extra: [
                {
                  label: 'Compare',
                  key: 'compare',
                  children: <ExtraRequestTabItemCompare />,
                  hidden: false,
                },
                {
                  label: 'Mock',
                  key: 'mock',
                  children: <ExtraRequestTabItemMock recordId={data?.recordId} />,
                  hidden: false,
                },
              ],
            },
          }}
          onSend={(r) => {
            return runRESTRequest({ request: r });
          }}
          onSave={(r) => {
            if (nodeType === 1 && id.length === 36) {
              setReqParams(r);
              saveRequestButtonRef.current.open();
            } else if (nodeType === 2) {
              FileSystemService.saveCase(convertSaveRequestData(workspaceId as string, id, r)).then(
                (res) => {
                  if (res.body.success) {
                    message.success('success');
                  } else {
                    message.error(res.responseStatusType.responseDesc);
                  }
                },
              );
            } else {
              FileSystemService.saveInterface(
                convertSaveRequestData(workspaceId as string, id, r),
              ).then((res) => {
                if (res.body.success) {
                  message.success('success');
                } else {
                  message.error(res.responseStatusType.responseDesc);
                }
              });
            }
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
