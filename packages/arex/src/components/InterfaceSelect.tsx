import { SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, ConfigProvider, Select, SelectProps, Space, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { ApplicationService } from '@/services';

export interface InterfaceSelectProps extends SelectProps {
  appId: string;
  open?: boolean;
  labelAsValue?: boolean;
}
const InterfaceSelect: FC<InterfaceSelectProps> = (props) => {
  const { appId, open, labelAsValue, ...restProps } = props;
  const { t } = useTranslation();

  const [value, setValue] = useState(props.value);
  const [searchValue, setSearchValue] = useState<string>();

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
                value: labelAsValue ? item.operationName : item.id,
              });
            } else {
              options[operation] = [
                {
                  label: item.operationName,
                  value: labelAsValue ? item.operationName : item.id,
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
                    const filtered = searchValue
                      ? options.filter((item) =>
                          item.label.toLowerCase().includes(searchValue?.toLowerCase() || ''),
                        )
                      : options;

                    const newValue: string[] = Array.from(
                      new Set([...(props.value || []), ...filtered.map((item) => item.value)]),
                    );

                    props.onChange?.(
                      newValue,
                      data
                        .filter((item) => newValue.includes(item.id || ''))
                        .map((item) => ({
                          label: item.operationName,
                          value: labelAsValue ? item.operationName : item.id,
                        })),
                    );
                    setValue(newValue);
                    setSearchValue(undefined);
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
    [data, props.value, t, searchValue],
  );

  return (
    <Select
      allowClear
      value={value}
      maxTagCount={3}
      mode='multiple'
      optionFilterProp='label'
      options={interfacesOptions}
      onChange={(value, option) => {
        setValue(value);
        props.onChange?.(value, option);
      }}
      searchValue={searchValue}
      onSearch={setSearchValue}
      {...restProps}
    />
  );
};

export default InterfaceSelect;
