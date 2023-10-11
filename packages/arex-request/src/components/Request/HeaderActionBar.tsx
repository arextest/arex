import { CopyOutlined, DeleteOutlined, FieldTimeOutlined, PlusOutlined } from '@ant-design/icons';
import { SpaceBetweenWrapper, TooltipButton } from '@arextest/arex-core';
import { Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { HeaderData } from '../HeadersTable';

export interface HeaderActionBarProps {
  onCopy?: () => void;
  onInsert?: (record: HeaderData) => void;
  onClearAll?: () => void;
}

const HeaderActionBar: FC<HeaderActionBarProps> = (props) => {
  const { t } = useTranslation();

  const handleAddParam = () => {
    const record: HeaderData = {
      id: String(Math.random()),
      key: '',
      value: '',
      active: true,
    };
    props.onInsert?.(record);
  };

  const handleAddRecord = () => {
    const record: HeaderData = {
      id: String(Math.random()),
      key: 'arex-force-record',
      value: 'true',
      active: true,
    };
    props.onInsert?.(record);
  };

  return (
    <SpaceBetweenWrapper>
      <Typography.Text type='secondary'> {t('request.headers')}</Typography.Text>
      <div>
        <TooltipButton title={'Copy'} icon={<CopyOutlined />} onClick={props.onCopy} />
        <TooltipButton title={t('record')} icon={<FieldTimeOutlined />} onClick={handleAddRecord} />
        <TooltipButton
          title={t('action.clear_all')}
          icon={<DeleteOutlined />}
          onClick={() => props.onClearAll?.()}
        />
        <TooltipButton title={t('add.new')} icon={<PlusOutlined />} onClick={handleAddParam} />
      </div>
    </SpaceBetweenWrapper>
  );
};

export default HeaderActionBar;
