import { SyncOutlined } from '@ant-design/icons';
import { PaneDrawer, SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Button, Space, Typography } from 'antd';
import React, { FC, useState } from 'react';
import { useImmer } from 'use-immer';

import { EditAreaPlaceholder, Icon } from '@/components';
import IgnoreTree from '@/panes/AppSetting/CompareConfig/NodesIgnore/IgnoreTree';
import TransformCard from '@/panes/AppSetting/CompareConfig/NodesTransform/TransformCard';
import { ComparisonService } from '@/services';
import { DependencyParams, TransformDetail, TransformNode } from '@/services/ComparisonService';

import { CONFIG_TARGET } from '../index';

export type NodesTransformProps = {
  appId?: string;
  operationId?: string;
  dependency?: DependencyParams;
  configTarget: CONFIG_TARGET;
  contractParsed?: { [key: string]: any };
  syncing?: boolean;
  onSync?: () => void;
  loadingContract?: boolean;
};

const TemporaryId = '_temporary_id_';

const NodesTransform: FC<NodesTransformProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [wrapperRef] = useAutoAnimate();

  const [transformData, setTransformData] = useImmer<Partial<TransformNode>[]>([]);
  const [edit, setEdit] = useState<string>();

  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [nodePath, setNodePath] = useState<string>();

  const { data: transformOptions = [] } = useRequest(ComparisonService.getTransformMethod, {
    ready: !!props.appId,
    defaultParams: [props.appId!],
  });

  const { data = [], run: queryTransformNode } = useRequest(
    () =>
      ComparisonService.queryTransformNode({
        appId: props.appId!,
        operationId: props.operationId,
        ...(props.dependency || {}),
      }),
    {
      ready: !!props.appId,
      refreshDeps: [props.appId, props.operationId, props.dependency],
      onSuccess: (data) => {
        setTransformData(data);
      },
    },
  );

  const { run: insertTransformNode } = useRequest(
    (transformDetail: TransformDetail) =>
      ComparisonService.insertTransformNode({
        appId: props.appId!,
        operationId: props.operationId!,
        ...(props.dependency || {}),
        transformDetail,
      }),
    {
      manual: true,
      ready: !!props.appId,
      onSuccess: (success) => {
        if (success) {
          message.success(t('message.createSuccess', { ns: 'common' }));
          setEdit(undefined);
        } else message.error(t('message.createFailed', { ns: 'common' }));
      },
    },
  );

  const { run: updateTransformNode } = useRequest(ComparisonService.updateTransformNode, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        setEdit(undefined);
      } else message.error(t('message.updateFailed', { ns: 'common' }));
    },
  });

  const { run: deleteTransformNode } = useRequest(ComparisonService.deleteTransformNode, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        message.success(t('message.delSuccess', { ns: 'common' }));
        setEdit(undefined);
        setNodePath(undefined);
        queryTransformNode();
      } else message.error(t('message.delFailed', { ns: 'common' }));
    },
  });

  return (
    <>
      <div ref={wrapperRef}>
        {transformData.map((item, dataIndex) => {
          return (
            <TransformCard
              key={item.id}
              edit={edit === item.id}
              data={item}
              options={transformOptions?.map((method) => ({ label: method, value: method }))}
              onNodePathChange={(path) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail!.nodePath = path;
                })
              }
              onPathLocationClick={() => setOpenIndex(dataIndex)}
              onMethodNameChange={(value, methodIndex) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail!.transformMethods[methodIndex].methodName =
                    value;
                })
              }
              onMethodArgsChange={(value, methodIndex) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail!.transformMethods[methodIndex].methodArgs =
                    value;
                })
              }
              onInsertBefore={(methodIndex) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail?.transformMethods.splice(methodIndex - 1, 0, {});
                })
              }
              onInsertAfter={(methodIndex) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail?.transformMethods.splice(methodIndex, 0, {});
                })
              }
              onDrop={(methodIndex) =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail?.transformMethods.splice(methodIndex - 1, 1);
                })
              }
              onAdd={() =>
                setTransformData((draft) => {
                  draft[dataIndex].transformDetail?.transformMethods.push({});
                })
              }
              onSave={() => {
                if (item.id && item.id !== TemporaryId) {
                  updateTransformNode({
                    id: item.id,
                    transformDetail: item.transformDetail!,
                  });
                } else {
                  insertTransformNode(item.transformDetail!);
                }
              }}
              onEdit={() => {
                setTransformData(data);
                setEdit(item.id);
              }}
              onCancel={() => {
                setTransformData(data);
                setEdit(undefined);
              }}
              onDelete={deleteTransformNode}
            />
          );
        })}

        <Button
          block
          disabled={!!edit}
          type='dashed'
          onClick={() => {
            setEdit(TemporaryId);
            setTransformData((draft) => {
              draft.push({
                id: TemporaryId,
                transformDetail: {
                  nodePath: [],
                  transformMethods: [{}],
                },
              });
            });
          }}
          style={{ height: '32px' }}
        >
          {t('appSetting.addTransformNode')}
        </Button>
      </div>

      <PaneDrawer
        width='60%'
        title={
          <SpaceBetweenWrapper>
            <Space size='middle'>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {t('appSetting.selectNodePath')}
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

            <Button
              size='small'
              type='primary'
              icon={<Icon name='Crosshair' />}
              onClick={() => {
                setTransformData((draft) => {
                  draft[openIndex].transformDetail!.nodePath =
                    nodePath?.split('/').filter(Boolean) || [];
                });
                setOpenIndex(-1);
                setNodePath(undefined);
              }}
            >
              {t('select', { ns: 'common' })}
            </Button>
          </SpaceBetweenWrapper>
        }
        open={openIndex > -1}
        onClose={() => {
          setOpenIndex(-1);
        }}
      >
        <EditAreaPlaceholder
          ready={!!props.contractParsed}
          dashedBorder
          title={t('appSetting.editArea')}
        >
          <IgnoreTree
            defaultExpandAll
            title={t('appSetting.clickToSelectNodePath')}
            loading={props.loadingContract}
            treeData={props.contractParsed!}
            selectedKeys={nodePath ? [nodePath] : []}
            onSelect={(value, target) => {
              setNodePath(target.node.key as string);
            }}
          />
        </EditAreaPlaceholder>
      </PaneDrawer>
    </>
  );
};

export default NodesTransform;
