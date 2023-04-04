import { Divider, Space, Switch } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DiffJsonTooltip from '../DiffJsonView/DiffJsonTooltip';
import { Label, SpaceBetweenWrapper } from '../styledComponents';

export interface DiffJsonViewTooltipOption {
  bordered?: boolean;
  defaultOnlyFailed?: boolean;
  typographyProps?: TextProps;
}

const useDiffPathTooltip: (option: DiffJsonViewTooltipOption) => {
  onlyFailed: boolean;
  Tooltip: FC<{ count: number }>;
} = (option) => {
  const { bordered = true, defaultOnlyFailed = true, typographyProps } = option;
  const { t } = useTranslation(['components']);

  const [onlyFailed, setOnlyFailed] = useState(defaultOnlyFailed);

  useEffect(() => {
    setOnlyFailed(defaultOnlyFailed);
  }, [defaultOnlyFailed]);

  const Tooltip: FC<{ count: number }> = (props) => (
    <>
      <SpaceBetweenWrapper style={{ margin: '4px 16px' }}>
        <Space size='large'>
          <div>
            <Label strong>{t('replay.sceneCount')}</Label>
            {props.count}
          </div>
          <DiffJsonTooltip {...typographyProps} />
        </Space>

        <span>
          <Label>{t('replay.viewFailedOnly')}</Label>
          <Switch size='small' checked={onlyFailed} onChange={setOnlyFailed} />
        </span>
      </SpaceBetweenWrapper>

      {bordered && <Divider style={{ margin: 0 }} />}
    </>
  );

  return {
    Tooltip,
    onlyFailed,
  };
};

export default useDiffPathTooltip;
