import { FilterOutlined } from '@ant-design/icons';
import { DiffJsonTooltip, Label, SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { Divider, Flex, Input, Space, Switch, theme, Tooltip } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC, useState } from 'react';

export interface DiffPathTooltipProps {
  count?: number | boolean;
  bordered?: boolean;
  defaultOnlyFailed?: boolean;
  mode?: 'multiple' | 'single';
  extra?: React.ReactNode;
  typographyProps?: TextProps;
  onFilterChange?: (onlyFailed: boolean) => void;
  onSearch?: (value: string) => void;
}

const CaseDiffTooltip: FC<DiffPathTooltipProps> = (props) => {
  const {
    count = 0,
    bordered = false,
    mode = 'multiple',
    extra,
    defaultOnlyFailed = true,
    typographyProps,
    onFilterChange,
    onSearch,
  } = props;
  const { t } = useTranslation('components');
  const { token } = theme.useToken();

  const [failedOnly, setFailedOnly] = useState(defaultOnlyFailed);
  const handleFilterChange = (checked: boolean) => {
    setFailedOnly(checked);
    onFilterChange?.(checked);
  };

  return (
    <>
      <SpaceBetweenWrapper style={{ margin: '8px 16px' }}>
        <Space size='large' className='diff-path-tooltip-title'>
          {mode === 'multiple' && count && (
            <div>
              <Label strong>{t('replay.sceneCount')}</Label>
              {count}
            </div>
          )}

          {mode === 'multiple' && (
            <Input.Search allowClear size='small' onSearch={onSearch} style={{ width: '240px' }} />
          )}

          <DiffJsonTooltip {...typographyProps} />
        </Space>

        <Space className='diff-path-tooltip-extra'>
          {mode === 'multiple' && (
            <>
              <Tooltip title={<Space>{t('replay.viewFailedOnly')}</Space>}>
                <Flex
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: '12px',
                    padding: '2px',
                  }}
                >
                  <FilterOutlined
                    style={{
                      margin: '0 4px',
                      color: failedOnly ? token.colorPrimaryActive : undefined,
                    }}
                  />
                  <Switch size='small' checked={failedOnly} onChange={handleFilterChange} />
                </Flex>
              </Tooltip>
              {extra}
            </>
          )}
        </Space>
      </SpaceBetweenWrapper>

      {bordered && <Divider style={{ margin: 0 }} />}
    </>
  );
};

export default CaseDiffTooltip;
