import { SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, ConfigProvider, Select, SelectProps, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

import { ApplicationService } from '@/services';

const InterfaceSelect = (props: SelectProps & { appId: string; open?: boolean }) => {
  const { appId, open, ...restProps } = props;
  const { t } = useTranslation();

  const [value, setValue] = useState(props.value);

  /**
   * 请求 InterfacesList
   */
  const { data = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Global'>({ appId }),
    {
      ready: open,
    },
  );

  const interfacesOptions = useMemo(
    () =>
      Object.entries(
        data.reduce<Record<string, { label: string; value?: string | null }[]>>((options, item) => {
          item.operationTypes?.forEach((operation) => {
            if (options[operation]) {
              options[operation].push({
                label: item.operationName,
                value: item.id,
              });
            } else {
              options[operation] = [
                {
                  label: item.operationName,
                  value: item.id,
                },
              ];
            }
          });
          return options;
        }, {}),
      ).map(([label, options]) => ({
        label: (
          <SpaceBetweenWrapper>
            <Typography.Text type='secondary'>{label}</Typography.Text>
            <Space>
              <ConfigProvider autoInsertSpaceInButton={false}>
                <Button
                  size='small'
                  onClick={(e) => {
                    const newValue: string[] = Array.from(
                      new Set([...(props.value || []), ...options.map((item) => item.value)]),
                    );

                    // @ts-ignore
                    props.onChange?.(newValue);
                    setValue(newValue);
                  }}
                >
                  <Typography.Text type='secondary'>{t('selectAll')}</Typography.Text>
                </Button>
              </ConfigProvider>
            </Space>
          </SpaceBetweenWrapper>
        ),
        options,
      })),
    [data, props.value, t],
  );

  return (
    <Select
      {...restProps}
      allowClear
      value={value}
      mode='multiple'
      maxTagCount={3}
      options={interfacesOptions}
      onChange={(value, option) => {
        props.onChange?.(value, option);
        setValue(value);
      }}
      optionFilterProp='label'
    />
  );
};

export default InterfaceSelect;
