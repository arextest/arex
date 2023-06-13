import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, AutoComplete, Button, Card, Col, Input, List, Modal, Row, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { SmallTextButton, SpaceBetweenWrapper, useTranslation } from 'arex-core';
import React, { FC, useMemo, useState } from 'react';

import { EditAreaPlaceholder } from '@/components';
import CompareConfigTitle from '@/panes/AppSetting/CompareConfig/CompareConfigTitle';
import { ComparisonService } from '@/services';
import { QueryIgnoreNode, QueryInterfaceIgnoreNode } from '@/services/ComparisonService';

import IgnoreTree, { getNodes } from './IgnoreTree';

const GLOBAL_OPERATION_ID = '__global__';

export type NodesIgnoreProps = {
  appId: string;
  interfaceId?: string;
  responseParsed: object;
};

const NodesIgnore: FC<NodesIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const [t] = useTranslation();

  const [search, setSearch] = useState<string | false>(false);
  const [editMode, setEditMode] = useState(false);

  const [openIgnoreModal, setOpenIgnoreModal] = useState(false);

  const [rawResponse, setRawResponse] = useState<string>();
  const [ignoredKey, setIgnoredKey] = useState<string>();

  /**
   * 获取 IgnoreNode
   */
  const {
    data: ignoreNodeList = [],
    loading: loadingIgnoreNode,
    run: queryIgnoreNode,
    mutate: setIgnoreNodeList,
  } = useRequest<QueryIgnoreNode[] | QueryInterfaceIgnoreNode[], []>(
    () =>
      ComparisonService.queryIgnoreNode({
        appId: props.appId,
        operationId: props.interfaceId === GLOBAL_OPERATION_ID ? null : props.interfaceId,
      }),
    {
      ready: props.interfaceId !== undefined,
      refreshDeps: [props.interfaceId],
      onBefore() {
        setIgnoreNodeList([]);
      },
    },
  );

  const ignoreNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? ignoreNodeList.filter((node) =>
            node.exclusions.join('/').toLowerCase().includes(search.toLowerCase()),
          )
        : ignoreNodeList,
    [ignoreNodeList, search],
  );

  function getPath(nodeList: DataNode[], pathList: string[], basePath = '') {
    nodeList.forEach((node) => {
      pathList.push(basePath ? basePath + '/' + node.title : (node.title as string));
      node.children && getPath(node.children, pathList, node.title as string);
    });
  }

  const nodePath = useMemo(() => {
    const pathList: string[] = [];
    getPath(getNodes(props.responseParsed, ''), pathList);
    return pathList.map((value) => ({ value }));
  }, [props.responseParsed]);

  /**
   * 删除 IgnoreNode
   */
  const { run: handleDeleteIgnoreNode } = useRequest(ComparisonService.deleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  const handleExitEdit = () => {
    console.log('handleExitEdit');
  };

  const handleEditSave = () => {
    console.log('handleEditSave');
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal');
    setOpenIgnoreModal(false);
  };

  return (
    <>
      <CompareConfigTitle
        title='Nodes Ignore'
        onSearch={() => setSearch('')}
        onAdd={() => {
          if (Object.keys(props.responseParsed).length) setOpenIgnoreModal(true);
          else message.info('empty response, please sync response first');
        }}
      />

      <Card size='small' bodyStyle={{ padding: 0 }} style={{ marginTop: '8px' }}>
        <List
          size='small'
          dataSource={ignoreNodesFiltered}
          loading={loadingIgnoreNode}
          header={
            search !== false && (
              <SpaceBetweenWrapper style={{ padding: '0 16px' }}>
                <Input.Search
                  size='small'
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <Button
                  size='small'
                  type='text'
                  icon={<CloseOutlined />}
                  onClick={() => setSearch(false)}
                />
              </SpaceBetweenWrapper>
            )
          }
          footer={
            editMode && (
              <List.Item style={{ padding: '0 8px' }}>
                <SpaceBetweenWrapper width={'100%'}>
                  <AutoComplete
                    size='small'
                    placeholder='Ignored key'
                    // ref={editInputRef}
                    options={nodePath}
                    filterOption={(inputValue, option) =>
                      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    value={ignoredKey}
                    onChange={setIgnoredKey}
                    style={{ width: '100%' }}
                  />
                  <span style={{ display: 'flex', marginLeft: '8px' }}>
                    <SmallTextButton icon={<CloseOutlined />} onClick={handleExitEdit} />
                    <SmallTextButton icon={<CheckOutlined />} onClick={handleEditSave} />
                  </span>
                </SpaceBetweenWrapper>
              </List.Item>
            )
          }
          renderItem={(node) => (
            <List.Item>
              <SpaceBetweenWrapper width={'100%'}>
                <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                <SmallTextButton
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteIgnoreNode({ id: node.id })}
                />
              </SpaceBetweenWrapper>
            </List.Item>
          )}
          locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
        />
      </Card>

      <Modal open={openIgnoreModal} okText={'保存'} onCancel={handleCloseModal}>
        <EditAreaPlaceholder
          dashedBorder
          title={t('appSetting.editArea')}
          ready={props.interfaceId !== GLOBAL_OPERATION_ID}
        >
          <IgnoreTree
            title={''}
            treeData={props.responseParsed}
            loading={false}
            // selectedKeys={checkedNodesData.exclusionsList}
            // onSave={handleIgnoreSave}

            // onSelect={handleIgnoreTreeSelect}
            // onEditResponse={handleEditResponse}
          />
        </EditAreaPlaceholder>
      </Modal>
    </>
  );
};

export default NodesIgnore;
