import { Divider, Input, Space, Switch } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

import DiffJsonTooltip from '../DiffJsonView/DiffJsonTooltip';
import { Label, SpaceBetweenWrapper } from '../styledComponents';

export interface DiffPathTooltipProps {
  count?: number;
  bordered?: boolean;
  defaultOnlyFailed?: boolean;
  mode?: 'multiple' | 'single';
  typographyProps?: TextProps;
  onFilterChange?: (onlyFailed: boolean) => void;
  onSearch?: (value: string) => void;
}

const DiffPathTooltip: FC<DiffPathTooltipProps> = (props) => {
  const {
    count = 0,
    bordered = false,
    mode = 'multiple',
    defaultOnlyFailed = true,
    typographyProps,
    onFilterChange,
    onSearch,
  } = props;
  const { t } = useTranslation(['components']);

  return (
    <>
      <SpaceBetweenWrapper style={{ margin: '4px 16px' }}>
        <Space size='large'>
          {mode === 'multiple' && (
            <div>
              <Label strong>{t('replay.sceneCount')}</Label>
              <CountUp duration={0.3} start={0} end={count} />
            </div>
          )}

          {mode === 'multiple' && (
            <Input.Search allowClear size='small' onSearch={onSearch} style={{ width: '240px' }} />
          )}

          <DiffJsonTooltip {...typographyProps} />
        </Space>

        {mode === 'multiple' && (
          <span>
            <Label>{t('replay.viewFailedOnly')}</Label>
            <Switch size='small' defaultChecked={defaultOnlyFailed} onChange={onFilterChange} />
          </span>
        )}
      </SpaceBetweenWrapper>

      {bordered && <Divider style={{ margin: 0 }} />}
    </>
  );
};

export default DiffPathTooltip;
