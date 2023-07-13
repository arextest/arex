import { FilterOutlined } from '@ant-design/icons';
import { DiffJsonTooltip, Label, SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import { Divider, Input, Space, Switch, theme } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC, useState } from 'react';

import { useTranslation } from '../../hooks';

export interface DiffPathTooltipProps {
  count?: number;
  bordered?: boolean;
  defaultOnlyFailed?: boolean;
  mode?: 'multiple' | 'single';
  extra?: React.ReactNode;
  typographyProps?: TextProps;
  onFilterChange?: (onlyFailed: boolean) => void;
  onSearch?: (value: string) => void;
}

const DiffPathTooltip: FC<DiffPathTooltipProps> = (props) => {
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
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();

  const [failedOnly, setFailedOnly] = useState(defaultOnlyFailed);
  const handleFilterChange = (checked: boolean) => {
    setFailedOnly(checked);
    onFilterChange?.(checked);
  };

  return (
    <>
      <SpaceBetweenWrapper style={{ margin: '4px 16px' }}>
        <Space size='large' className='diff-path-tooltip-title'>
          {mode === 'multiple' && (
            <div>
              <Label strong>{t('diffPath.sceneCount')}</Label>
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
              <TooltipButton
                tooltipProps={{ trigger: 'click' }}
                icon={<FilterOutlined />}
                title={
                  <Space>
                    {t('diffPath.viewFailedOnly')}
                    <Switch size='small' checked={failedOnly} onChange={handleFilterChange} />
                  </Space>
                }
                style={{ color: failedOnly ? token.colorPrimaryActive : undefined }}
              />
              {extra}
            </>
          )}
        </Space>
      </SpaceBetweenWrapper>

      {bordered && <Divider style={{ margin: 0 }} />}
    </>
  );
};

export default DiffPathTooltip;
