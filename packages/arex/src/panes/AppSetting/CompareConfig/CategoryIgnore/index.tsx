import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { App, Button, Flex, Select, SelectProps, Space, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { CONFIG_TARGET } from '@/panes/AppSetting/CompareConfig';
import { ApplicationService, ComparisonService } from '@/services';
import { IgnoreCategory } from '@/services/ComparisonService';

export type CategoryIgnoreProps = {
  appId: string;
  operationId?: string;
  configTarget: CONFIG_TARGET;
};

const CategoryIgnore: FC<CategoryIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [footerRef] = useAutoAnimate();

  const [mode, setMode] = useState<'read' | 'add' | 'delete'>('read');

  const [operationTypeValue, setOperationTypeValue] = useState<string>();
  const [operationNameValue, setOperationNameValue] = useState<string>();

  useEffect(() => {
    setOperationNameValue(undefined);
  }, [props.operationId, props.configTarget]);

  const [selectedRowKey, setSelectedRowKey] = useState<string>();

  const [optionsGroupMap, setOptionsGroupMap] = useState<Map<string, Set<string>>>(new Map());

  const [operationNameOptions, setOperationNameOptions] = useState<SelectProps['options']>([]);

  const [categoryTypeOptions, setCategoryOptions] = useState<SelectProps['options']>([]);
  useRequest(ComparisonService.queryCategoryType, {
    onSuccess(res) {
      const options = res
        .filter((item) => !item.entryPoint)
        .map((item) => ({
          label: item.name,
          value: item.name,
        }));
      setCategoryOptions(options);
    },
  });

  // 获取接口依赖并聚合
  const { data: interfacesList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ appId: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess(res) {
        const groupMap = res.reduce((group, item) => {
          if (!item.dependencyList) return group;

          item.dependencyList?.forEach((dependency) => {
            if (group.has(dependency.operationType)) {
              group.get(dependency.operationType)?.add(dependency.operationName);
            } else {
              group.set(dependency.operationType, new Set([dependency.operationName]));
            }
          });
          return group;
        }, new Map<string, Set<string>>());

        setOptionsGroupMap(groupMap);
      },
    },
  );

  const { data: ignoreCategoryData = [], run: queryIgnoreCategory } = useRequest(
    () =>
      ComparisonService.queryIgnoreCategory({
        appId: props.appId,
        operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
      }),
    {
      ready: !!(
        props.appId &&
        (props.configTarget === CONFIG_TARGET.GLOBAL || // GLOBAL ready
          // INTERFACE ready
          (props.configTarget === CONFIG_TARGET.INTERFACE && props.operationId))
      ),
      refreshDeps: [props.operationId, props.configTarget],
      onSuccess(res) {
        setMode('read');
        setSelectedRowKey(undefined);
        setOperationNameValue(undefined);
        setOperationTypeValue(undefined);
      },
    },
  );

  const { run: insertIgnoreCategory } = useRequest(
    (ignoreCategoryDetail: IgnoreCategory) =>
      ComparisonService.insertIgnoreCategory({
        appId: props.appId,
        operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
        ignoreCategoryDetail,
      }),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          message.success(t('message.updateSuccess'));
          queryIgnoreCategory();
        } else message.error(t('message.updateFailed'));
      },
    },
  );

  const { run: deleteIgnoreCategory } = useRequest(ComparisonService.deleteIgnoreCategory, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.delSuccess'));
        queryIgnoreCategory();
      } else message.error(t('message.delFailed'));
    },
  });

  const handleAdd = () => {
    if (operationTypeValue && operationNameValue) {
      insertIgnoreCategory({
        operationType: operationTypeValue,
        operationName: operationNameValue,
      });
    }
  };

  const handleDelete = () => {
    if (selectedRowKey) deleteIgnoreCategory({ id: selectedRowKey });
    else message.error(t('message.selectRow'));
  };

  return (
    <div>
      <Table
        bordered
        dataSource={ignoreCategoryData}
        rowKey='id'
        pagination={false}
        columns={[
          {
            title: t('appSetting.categoryType', { ns: 'components' }),
            dataIndex: ['ignoreCategoryDetail', 'operationType'],
          },
          {
            title: t('appSetting.categoryName', { ns: 'components' }),
            dataIndex: ['ignoreCategoryDetail', 'operationName'],
          },
        ]}
        rowSelection={
          mode === 'delete'
            ? {
                type: 'radio',
                onChange: (id) => setSelectedRowKey(id[0] as string),
              }
            : undefined
        }
        footer={() => (
          <div ref={footerRef}>
            {mode === 'read' ? (
              <Flex key='read' justify={'end'}>
                <Button type='text' icon={<PlusOutlined />} onClick={() => setMode('add')}>
                  {t('add')}
                </Button>
                <Button type='text' icon={<DeleteOutlined />} onClick={() => setMode('delete')}>
                  {t('delete')}
                </Button>
              </Flex>
            ) : mode === 'add' ? (
              <div key='add'>
                <Space>
                  <Select
                    value={operationTypeValue}
                    options={categoryTypeOptions}
                    onSelect={(value) => {
                      setOperationTypeValue(value);
                      setOperationNameValue(undefined);

                      setOperationNameOptions(
                        props.configTarget === CONFIG_TARGET.GLOBAL
                          ? Array.from(optionsGroupMap.get(value) || [])?.map((value) => ({
                              label: value,
                              value,
                            }))
                          : interfacesList
                              ?.find((item) => item.id === props.operationId)
                              ?.dependencyList?.filter((item) => item.operationType === value)
                              .map((item) => ({
                                label: item.operationName,
                                value: item.operationName,
                              })) || [],
                      );
                    }}
                    placeholder={t('appSetting.categoryTypePlaceholder', { ns: 'components' })}
                    style={{ flex: 1 }}
                  />

                  <Select
                    value={operationNameValue}
                    options={operationNameOptions}
                    onSelect={setOperationNameValue}
                    placeholder={t('appSetting.categoryNamePlaceholder', { ns: 'components' })}
                    style={{ flex: 1 }}
                  />
                </Space>
                <Space style={{ marginLeft: 'auto', float: 'right' }}>
                  <Button type='text' icon={<CloseOutlined />} onClick={() => setMode('read')}>
                    {t('cancel')}
                  </Button>

                  <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                    {t('add')}
                  </Button>
                </Space>
              </div>
            ) : (
              <Flex key='delete' justify={'end'}>
                <Button type='text' icon={<CloseOutlined />} onClick={() => setMode('read')}>
                  {t('cancel')}
                </Button>
                <Button danger type='text' icon={<DeleteOutlined />} onClick={handleDelete}>
                  {t('delete')}
                </Button>
              </Flex>
            )}
          </div>
        )}
        style={{ marginTop: '8px' }}
      />
    </div>
  );
};

export default CategoryIgnore;
