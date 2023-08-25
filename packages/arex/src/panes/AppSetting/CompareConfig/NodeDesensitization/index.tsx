import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  css,
  HoveredActionButton,
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

import { CONFIG_TARGET } from '@/panes/AppSetting/CompareConfig';
import { ComparisonService } from '@/services';
import { DependencyParams, QueryEncryptionNode } from '@/services/ComparisonService';

import CompareConfigTitle, { CompareConfigTitleProps } from '../CompareConfigTitle';
import TreeCarousel from '../TreeCarousel';
import DataDesensitizationNodeConfig from './DataDesensitizationNodeConfig';
import DataDesensitizationTree from './DataDesensitizationTree';

export type NodeMaskingProps = {
  appId: string;
  operationId?: string;
  dependency?: DependencyParams;
  readOnly?: boolean;
  syncing?: boolean;
  loadingContract?: boolean;
  configTarget: CONFIG_TARGET;
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
  const carouselRef = React.useRef<CarouselRef>(null);

  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.DataTree);

  const [activeKey, setActiveKey] = useState<string | string[]>([ActiveKey]);
  const [search, setSearch] = useState<string | false>(false);

  const [methodName, setMethodName] = useState<string>();
  const [path, setPath] = useState<string[]>();

  const [openMaskingModal, setOpenMaskingModal] = useState<string | boolean>(false); // boolean: insert mode, string: edit mode

  const handleSearch: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setTimeout(() => searchRef.current?.focus());

    setSearch('');
  };

  const commonParams = useMemo(
    () => ({
      appId: props.appId,
      operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
      ...(props.configTarget === CONFIG_TARGET.DEPENDENCY ? props.dependency : {}),
    }),
    [props.appId, props.configTarget, props.dependency, props.operationId],
  );

  const {
    data: maskingNodes = [],
    loading: loadingMaskingNode,
    refresh: getMaskingNodes,
  } = useRequest(() => ComparisonService.queryEncryptionNode(commonParams), {
    ready: !!(
      props.appId &&
      ((props.configTarget === CONFIG_TARGET.INTERFACE && props.operationId) || // INTERFACE ready
        (props.configTarget === CONFIG_TARGET.DEPENDENCY && props.dependency))
    ),
    refreshDeps: [props.configTarget, props.operationId, props.dependency],
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

  const { run: updateEncryptionNode } = useRequest(ComparisonService.updateEncryptionNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        getMaskingNodes();
      }
    },
  });

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
    setPath(undefined);
    setMethodName(undefined);
    setOpenMaskingModal(false);
    setTreeEditMode(TreeEditModeEnum.DataTree);
  };

  const handleSaveMasking = () => {
    typeof openMaskingModal === 'string'
      ? updateEncryptionNode({ id: openMaskingModal, methodName })
      : insertEncryptionNode({ path, methodName });
    setOpenMaskingModal(false);
  };

  const handleEditEncryption = (node: QueryEncryptionNode) => {
    setPath(node.path);
    setMethodName(node.methodName);
    changeCarousel(TreeEditModeEnum.MethodSelect);
    setOpenMaskingModal(node.id);
  };

  const handleEditCollapseItem: TreeProps['onSelect'] = (path, info) => {
    setPath(path[0].toString().split('/').filter(Boolean));
    changeCarousel(TreeEditModeEnum.MethodSelect);
    setOpenMaskingModal(true);
  };

  function changeCarousel(index: TreeEditModeEnum) {
    setTreeEditMode(index);
    setTimeout(() => carouselRef.current?.goTo(index)); // 防止初始化时 carouselRef 未绑定
  }

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
                title={t('appSetting.nodesEncryption', { ns: 'components' })}
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
                          <HoveredActionButton
                            hoveredNode={
                              <Button
                                size='small'
                                icon={<EditOutlined />}
                                onClick={() => handleEditEncryption(node)}
                              >
                                Edit
                              </Button>
                            }
                          >
                            <Tag>{node.methodName}</Tag>
                          </HoveredActionButton>

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
                {t('appSetting.nodesEncryption', { ns: 'components' })}
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
        open={!!openMaskingModal}
        onClose={handleCancelEdit}
      >
        <TreeCarousel ref={carouselRef} beforeChange={(from, to) => setTreeEditMode(to)}>
          <DataDesensitizationTree
            loading={props.loadingContract}
            treeData={props.contractParsed}
            encryptionNodeList={maskingNodes}
            onSelect={handleEditCollapseItem}
          />

          <DataDesensitizationNodeConfig path={path} value={methodName} onChange={setMethodName} />
        </TreeCarousel>
      </PaneDrawer>
    </>
  );
};

export default NodeEncryption;
