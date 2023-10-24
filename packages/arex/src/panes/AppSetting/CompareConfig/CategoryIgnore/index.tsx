import { Label, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Card, Select, SelectProps } from 'antd';
import React, { FC, useState } from 'react';

import { CONFIG_TARGET } from '@/components';
import { ComparisonService } from '@/services';

export type CategoryIgnoreProps = {
  appId: string;
  operationId?: string;
  configTarget: CONFIG_TARGET;
};

const CategoryIgnore: FC<CategoryIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation();

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

  const [ignoreCategoryValue, setIgnoreCategoryValue] = useState<string[]>();
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
        setIgnoreCategoryValue(res?.ignoreCategory);
      },
    },
  );

  const { run: insertIgnoreCategory } = useRequest(
    (ignoreCategory: string[]) =>
      ComparisonService.insertIgnoreCategory({
        appId: props.appId,
        operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
        ignoreCategory,
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
    if (ignoreCategoryData && ignoreCategoryValue?.length) {
      // update when ignoreCategoryData and ignoreCategoryValue is both not empty
      updateIgnoreCategory({ id: ignoreCategoryData.id, ignoreCategory: ignoreCategoryValue });
    } else {
      // delete when ignoreCategoryValue is empty
      ignoreCategoryData && deleteIgnoreCategory({ id: ignoreCategoryData.id });
      // insert when ignoreCategoryData is empty
      ignoreCategoryValue?.length && insertIgnoreCategory(ignoreCategoryValue);
    }
  };

  return (
    <div>
      <Card size='small'>
        <Label>{t('appSetting.categoryType', { ns: 'components' })}</Label>
        <Select
          allowClear
          mode='tags'
          value={ignoreCategoryValue}
          options={categoryTypeOptions}
          placeholder={t('appSetting.chooseCategoryType', { ns: 'components' })}
          onChange={setIgnoreCategoryValue}
          style={{ width: '400px' }}
        />
        <Button type='primary' style={{ marginLeft: '16px' }} onClick={handleSave}>
          {t('save')}
        </Button>
      </Card>
    </div>
  );
};

export default CategoryIgnore;
