import { Label, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Card, Select, SelectProps, Space, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

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

  const [operationTypeValue, setOperationTypeValue] = useState<string>();
  const [operationNameValue, setOperationNameValue] = useState<string>();

  const [optionsGroupMap, setOptionsGroupMap] = useState<Map<string, string[]>>(new Map());
  const operationTypeOptions = useMemo(
    () =>
      Array.from(optionsGroupMap).map(([key, value]) => ({
        label: key,
        value: key,
        children: value.map((item) => ({
          label: item,
          value: item,
        })),
      })),
    [optionsGroupMap],
  );
  const [operationNameOptions, setOperationNameOptions] = useState<SelectProps['options']>([]);

  // 获取接口依赖并聚合
  useRequest(
    () => ApplicationService.queryInterfacesList<'Interface'>({ appId: props.appId as string }),
    {
      ready: !!props.appId,
      onSuccess(res) {
        const groupMap = res.reduce((group, item) => {
          item.operationTypes?.forEach((type) => {
            if (group.has(type)) {
              group.get(type)?.push(item.operationName);
            } else {
              group.set(type, [item.operationName]);
            }
          });
          return group;
        }, new Map<string, string[]>());

        setOptionsGroupMap(groupMap);
      },
    },
  );

  const { data: ignoreCategoryData, run: queryIgnoreCategory } = useRequest(
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
        // setIgnoreCategoryValue(res?.ignoreCategory);
      },
    },
  );

  const { run: insertIgnoreCategory } = useRequest(
    (ignoreCategories: IgnoreCategory[]) =>
      ComparisonService.insertIgnoreCategory({
        appId: props.appId,
        operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
        ignoreCategories,
      }),
    {
      manual: true,
      onSuccess(success) {
        success
          ? message.success(t('message.updateSuccess'))
          : message.error(t('message.updateFailed'));
        queryIgnoreCategory();
      },
    },
  );

  const { run: updateIgnoreCategory } = useRequest(ComparisonService.updateIgnoreCategory, {
    manual: true,
    onSuccess(success) {
      success
        ? message.success(t('message.updateSuccess'))
        : message.error(t('message.updateFailed'));
      queryIgnoreCategory();
    },
  });

  const { run: deleteIgnoreCategory } = useRequest(ComparisonService.deleteIgnoreCategory, {
    manual: true,
    onSuccess(success) {
      success ? message.success(t('message.delSuccess')) : message.error(t('message.delFailed'));
      queryIgnoreCategory();
    },
  });

  const handleSave = () => {
    // if (ignoreCategoryData && ignoreCategoryValue?.length) {
    //   // update when ignoreCategoryData and ignoreCategoryValue is both not empty
    //   updateIgnoreCategory({ id: ignoreCategoryData.id, ignoreCategory: ignoreCategoryValue });
    // } else {
    //   // delete when ignoreCategoryValue is empty
    //   ignoreCategoryData && deleteIgnoreCategory({ id: ignoreCategoryData.id });
    //   // insert when ignoreCategoryData is empty
    //   ignoreCategoryValue?.length && insertIgnoreCategory(ignoreCategoryValue);
    // }
  };

  const handleAdd = () => {
    if (operationTypeValue && operationNameValue) {
      insertIgnoreCategory([
        {
          operationType: operationTypeValue,
          operationName: operationNameValue,
        },
      ]);
    } else {
      message.error(t('message.addFailed'));
    }
  };

  return (
    <div>
      <Card>
        <Space>
          <div>
            <Label type='secondary' style={{ display: 'block' }}>
              operationType
            </Label>
            <Select
              value={operationTypeValue}
              options={operationTypeOptions}
              onSelect={(value) => {
                setOperationTypeValue(value);
                setOperationNameOptions(
                  optionsGroupMap.get(value)?.map((value) => ({ label: value, value })) || [],
                );
              }}
              style={{ width: '200px' }}
            />
          </div>

          <div>
            <Label type='secondary' style={{ display: 'block' }}>
              operationName
            </Label>
            <Select
              value={operationNameValue}
              options={operationNameOptions}
              onSelect={setOperationNameValue}
              style={{ width: '200px' }}
            />
          </div>

          <div>
            <Typography.Text style={{ display: 'block' }}> &nbsp;</Typography.Text>
            <Button type='primary' style={{ marginLeft: '16px' }} onClick={handleAdd}>
              {t('add')}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CategoryIgnore;
