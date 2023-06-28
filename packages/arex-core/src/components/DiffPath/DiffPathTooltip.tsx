import { FilterOutlined } from '@ant-design/icons';
import { Divider, Input, Space, Switch, theme } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DiffJsonTooltip from '../DiffJsonView/DiffJsonTooltip';
import { Label, SpaceBetweenWrapper } from '../index';
import TooltipButton from '../TooltipButton';

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
          {extra}

          {mode === 'multiple' && (
            <>
              <TooltipButton
                tooltipProps={{ trigger: 'click' }}
                icon={<FilterOutlined />}
                title={
                  <Space>
                    {t('replay.viewFailedOnly')}
                    <Switch size='small' checked={failedOnly} onChange={handleFilterChange} />
                  </Space>
                }
                style={{ color: failedOnly ? token.colorPrimaryActive : undefined }}
              />
            </>
          )}
        </Space>
      </SpaceBetweenWrapper>

      {bordered && <Divider style={{ margin: 0 }} />}
    </>
  );
};

export default DiffPathTooltip;
