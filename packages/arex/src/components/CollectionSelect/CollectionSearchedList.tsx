import { FolderOutlined } from '@ant-design/icons';
import {
  css,
  EmptyWrapper,
  OperatorType,
  RequestMethodIcon,
  SearchDataType,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Menu, MenuProps, theme } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';

import { CollectionTreeType } from '@/components/CollectionSelect/index';
import { CollectionNodeType } from '@/constant';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections } from '@/store';
import { CaseSourceType } from '@/store/useCollections';

export type CollectionSearchedListProps = {
  height?: number;
  workspaceId: string;
  searchValue?: SearchDataType;
  onSelect?: (id: string, node: CollectionTreeType) => void;
};

export type CollectionSearchedListRef = {
  search: () => void;
};

const CollectionSearchedList = forwardRef<CollectionSearchedListRef, CollectionSearchedListProps>(
  (props, ref) => {
    const { token } = theme.useToken();

    const { setExpandedKeys } = useCollections();

    const {
      data,
      loading,
      run: search,
    } = useRequest(
      () =>
        FileSystemService.searchCollectionItems({
          workspaceId: props.workspaceId,
          pageSize: 10,
          keywords: props.searchValue?.keyword?.trim(),
          labels: props.searchValue?.structuredValue?.map((item) => ({
            key: item.category!,
            operator: item.operator as OperatorType,
            value: item.value!,
          })),
        }),
      {
        debounceWait: 300,
        ready: !!props.searchValue,
        refreshDeps: [props.searchValue],
      },
    );

    useImperativeHandle(
      ref,
      () => ({
        search,
      }),
      [],
    );

    const handleSelect: MenuProps['onClick'] = async ({ key }) => {
      const [nodeType, id] = key.split('-');

      let nodes: CollectionType[] | undefined = [];
      if (parseInt(nodeType) === CollectionNodeType.folder) {
        nodes = data?.folderNodes;
      } else if (parseInt(nodeType) === CollectionNodeType.interface) {
        nodes = data?.interfaceNodes;
      } else if (parseInt(nodeType) === CollectionNodeType.case) {
        nodes = data?.caseNodes;
      }
      const node = nodes?.find((item) => item.infoId === id);
      if (!node) return;

      const pathInfo = await FileSystemService.queryPathInfo({
        infoId: node.infoId,
        nodeType: node.nodeType,
      });

      setExpandedKeys(pathInfo.map((item) => item.id));
      // @ts-ignore
      node && props.onSelect?.(id, { ...node, pathInfo });
    };

    return (
      <EmptyWrapper
        loading={loading}
        empty={!data?.folderNodes.length && !data?.interfaceNodes.length && !data?.caseNodes.length}
      >
        <Menu
          items={([] as Required<MenuProps>['items'])
            .concat(data?.folderNodes.length ? [{ type: 'divider' }] : [])
            .concat(
              data?.folderNodes.map((item) => ({
                key: `${CollectionNodeType.folder}-${item.infoId}`,
                label: (
                  <>
                    {<FolderOutlined style={{ marginRight: token.marginXS }} />}
                    {item.nodeName}
                  </>
                ),
              })) || [],
            )
            .concat(data?.interfaceNodes.length ? [{ type: 'divider' }] : [])
            .concat(
              data?.interfaceNodes.map((item) => ({
                key: `${CollectionNodeType.interface}-${item.infoId}`,
                label: (
                  <>
                    {React.createElement(RequestMethodIcon[item.method || ''] || 'div')}
                    {item.nodeName}
                  </>
                ),
              })) || [],
            )
            .concat(data?.caseNodes.length ? [{ type: 'divider' }] : [])
            .concat(
              data?.caseNodes.map((item) => ({
                key: `${CollectionNodeType.case}-${item.infoId}`,
                label: (
                  <>
                    {React.createElement(
                      RequestMethodIcon[
                        item.caseSourceType === CaseSourceType.AREX ? 'arex' : 'case'
                      ] || 'div',
                    )}
                    {item.nodeName}
                  </>
                ),
              })) || [],
            )}
          onClick={handleSelect}
          css={css`
            height: ${props.height ? `${props.height}px` : '100%'};
            overflow-y: auto;
            background-color: transparent;
            border-inline-end: none !important;
            .ant-menu-item {
              height: 21px;
              line-height: 21px;
            }
          `}
        />
      </EmptyWrapper>
    );
  },
);

export default CollectionSearchedList;
