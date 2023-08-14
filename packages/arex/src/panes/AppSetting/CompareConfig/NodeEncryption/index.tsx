import { CloseOutlined, DeleteOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import {
  css,
  PaneDrawer,
  SmallTextButton,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  App,
  Button,
  ButtonProps,
  Card,
  Collapse,
  Input,
  InputRef,
  List,
  Space,
  Tag,
  Typography,
} from 'antd';
import { TreeProps } from 'antd/es';
import { CarouselRef } from 'antd/lib/carousel';
import React, { FC, useMemo, useRef, useState } from 'react';

import { CONFIG_TYPE } from '@/panes/AppSetting/CompareConfig';
import { ComparisonService } from '@/services';
import { DependencyParams } from '@/services/ComparisonService';

import CompareConfigTitle, { CompareConfigTitleProps } from '../CompareConfigTitle';
import TreeCarousel from '../TreeCarousel';
import DataEncryptionNodeConfig from './DataEncryptionNodeConfig';
import DataEncryptionTree from './DataEncryptionTree';

export type NodeMaskingProps = {
  appId: string;
  operationId?: string;
  dependency?: DependencyParams;
  readOnly?: boolean;
  syncing?: boolean;
  loadingContract?: boolean;
  configType: CONFIG_TYPE;
  contractParsed: { [p: string]: any };
  onAdd?: () => void;
  onSync?: () => void;
  onClose?: () => void;
};

const ActiveKey = 'encryption';
enum TreeEditModeEnum {
  DataTree,
  MethodSelect,
}

const NodeEncryption: FC<NodeMaskingProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();

  const searchRef = useRef<InputRef>(null);
  const treeCarouselRef = React.useRef<CarouselRef>(null);

  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.DataTree);

  const [activeKey, setActiveKey] = useState<string | string[]>([ActiveKey]);
  const [search, setSearch] = useState<string | false>(false);

  const [methodName, setMethodName] = useState<string>();
  const [path, setPath] = useState<string[]>();

  const [openMaskingModal, setOpenMaskingModal] = useState(false);

  const handleSearch: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setTimeout(() => searchRef.current?.focus());

    setSearch('');
  };

  const commonParams = useMemo(
    () => ({
      appId: props.appId,
      operationId: props.configType === CONFIG_TYPE.GLOBAL ? undefined : props.operationId,
      ...(props.configType === CONFIG_TYPE.DEPENDENCY ? props.dependency : {}),
    }),
    [props.appId, props.configType, props.dependency, props.operationId],
  );

  const {
    data: maskingNodes = [],
    loading: loadingMaskingNode,
    refresh: getMaskingNodes,
  } = useRequest(() => ComparisonService.queryEncryptionNode(commonParams), {
    ready: !!(
      props.appId &&
      ((props.configType === CONFIG_TYPE.INTERFACE && props.operationId) || // INTERFACE ready
        (props.configType === CONFIG_TYPE.DEPENDENCY && props.dependency))
    ),
    refreshDeps: [props.configType, props.operationId, props.dependency],
  });

  const maskingNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? maskingNodes.filter((node) =>
            node.path.join('/').toLowerCase().includes(search.toLowerCase()),
          )
        : maskingNodes,
    [maskingNodes, search],
  );

  const { run: insertEncryptionNode } = useRequest(
    (params) => ComparisonService.insertEncryptionNode({ ...commonParams, ...params }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success(t('message.delSuccess', { ns: 'common' }));
          getMaskingNodes();
        }
      },
      onFinally() {
        setMethodName(undefined);
      },
    },
  );

  const { run: deleteEncryptionNode } = useRequest(ComparisonService.deleteEncryptionNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.delSuccess', { ns: 'common' }));
        getMaskingNodes();
      }
    },
  });

  const handleMaskingAdd: CompareConfigTitleProps['onAdd'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    props.onAdd?.();
    setOpenMaskingModal(true);
  };

  const handleDeleteMaskingNode = (params: { id: string }) => {
    deleteEncryptionNode(params);
  };

  const handleCancelEdit = () => {
    setMethodName(undefined);
    setOpenMaskingModal(false);
    setTreeEditMode(TreeEditModeEnum.DataTree);
  };

  const handleSaveMasking = () => {
    setOpenMaskingModal(false);
    insertEncryptionNode({ path, methodName });
  };

  const handleEditCollapseItem: TreeProps['onSelect'] = (path, info) => {
    setPath(path[0].toString().split('/').filter(Boolean));
    setTreeEditMode(TreeEditModeEnum.MethodSelect);
    setOpenMaskingModal(true);

    setTimeout(() => treeCarouselRef.current?.goTo(1)); // 防止初始化时 treeCarouselRef 未绑定
  };

  return (
    <>
      <Collapse
        size='small'
        activeKey={activeKey}
        items={[
          {
            key: ActiveKey,
            label: (
              <CompareConfigTitle
                title='Nodes Encryption'
                readOnly={props.readOnly}
                onSearch={handleSearch}
                onAdd={handleMaskingAdd}
              />
            ),
            children: (
              <Card bordered={false} size='small' bodyStyle={{ padding: 0 }}>
                <List
                  size='small'
                  dataSource={maskingNodesFiltered}
                  loading={loadingMaskingNode}
                  header={
                    search !== false && (
                      <SpaceBetweenWrapper style={{ padding: '0 16px' }}>
                        <Input.Search
                          size='small'
                          ref={searchRef}
                          placeholder='Search for ignored key'
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
                  renderItem={(node) => (
                    <List.Item>
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{node.path.join('/')}</Typography.Text>
                        <Space>
                          <Tag>{node.methodName}</Tag>
                          {!props.readOnly && (
                            <SmallTextButton
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteMaskingNode({ id: node.id })}
                            />
                          )}
                        </Space>
                      </SpaceBetweenWrapper>
                    </List.Item>
                  )}
                  locale={{ emptyText: t('appSetting.noEncryptionNodes') }}
                />
              </Card>
            ),
          },
        ]}
        onChange={setActiveKey}
        css={css`
          flex: 1;
          margin: 0 16px 16px 0;
          height: fit-content;
          .ant-collapse-content-box {
            padding: 0 !important;
          }
        `}
      />

      <PaneDrawer
        destroyOnClose
        width='60%'
        title={
          <SpaceBetweenWrapper>
            <Space size='middle'>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {t('appSetting.nodesSort')}
              </Typography.Title>

              <Button
                size='small'
                disabled={props.syncing}
                icon={<SyncOutlined spin={props.syncing} />}
                onClick={props.onSync}
              >
                {t('appSetting.sync', { ns: 'components' })}
              </Button>
            </Space>
            {treeEditMode === TreeEditModeEnum.MethodSelect && (
              <Button
                size='small'
                type='primary'
                icon={<SaveOutlined />}
                onClick={handleSaveMasking}
              >
                {t('save', { ns: 'common' })}
              </Button>
            )}
          </SpaceBetweenWrapper>
        }
        open={openMaskingModal}
        onClose={handleCancelEdit}
      >
        <TreeCarousel ref={treeCarouselRef} beforeChange={(from, to) => setTreeEditMode(to)}>
          <DataEncryptionTree
            loading={props.loadingContract}
            treeData={props.contractParsed}
            // sortNodeList={maskingNodes}
            onSelect={handleEditCollapseItem}
          />

          <DataEncryptionNodeConfig value={methodName} onChange={setMethodName} />
        </TreeCarousel>
      </PaneDrawer>
    </>
  );
};

export default NodeEncryption;
