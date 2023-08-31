import { Label } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, Card, Select, SelectProps } from 'antd';
import React, { FC, useState } from 'react';

import { CONFIG_TARGET } from '@/panes/AppSetting/CompareConfig';
import { ComparisonService } from '@/services';

export type CategoryIgnoreProps = {
  appId: string;
  operationId?: string;
  configTarget: CONFIG_TARGET;
};

const CategoryIgnore: FC<CategoryIgnoreProps> = (props) => {
  const [categoryTypeOptions, setCategoryOptions] = useState<SelectProps['options']>([]);
  useRequest(ComparisonService.queryCategoryType, {
    onSuccess(res) {
      console.log(res);
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
  const { data: ignoreCategoryData } = useRequest(
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
        res && setIgnoreCategoryValue(res.ignoreCategory);
      },
    },
  );

  const { run: updateIgnoreCategory } = useRequest(
    (ignoreCategory: string[]) =>
      ComparisonService.updateIgnoreCategory({
        appId: props.appId,
        operationId: props.configTarget === CONFIG_TARGET.GLOBAL ? undefined : props.operationId,
        ignoreCategory,
      }),
    {
      manual: true,
    },
  );

  const { run: deleteIgnoreCategory } = useRequest(ComparisonService.deleteIgnoreCategory, {
    manual: true,
  });

  const handleSave = () => {
    console.log('save', ignoreCategoryValue);
    ignoreCategoryValue && ignoreCategoryValue.length
      ? updateIgnoreCategory(ignoreCategoryValue)
      : ignoreCategoryData && deleteIgnoreCategory({ id: ignoreCategoryData.id }); // TODO
  };
  return (
    <div>
      <Card size='small'>
        <Label>Category Type</Label>
        <Select
          allowClear
          mode='tags'
          value={ignoreCategoryValue}
          options={categoryTypeOptions}
          onChange={setIgnoreCategoryValue}
          style={{ width: '400px' }}
        />
        <Button type='primary' style={{ marginLeft: '16px' }} onClick={handleSave}>
          Save
        </Button>
      </Card>
    </div>
  );
};

export default CategoryIgnore;
