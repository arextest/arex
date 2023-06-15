import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { SmallTextButton, TooltipButton, useTranslation } from 'arex-core';
import React, { FC } from 'react';

export type CompareConfigTitleProps = {
  title: string;
  onAdd?: () => void;
  onSearch?: () => void;
};

const CompareConfigTitle: FC<CompareConfigTitleProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Space>
      <Typography.Text strong>{props.title}</Typography.Text>
      <div>
        <SmallTextButton
          key='search'
          icon={<SearchOutlined />}
          onClick={() => props.onSearch?.()}
        />
        <TooltipButton
          key='add'
          icon={<PlusOutlined />}
          title={t('appSetting.addKey')}
          onClick={() => props.onAdd?.()}
        />
      </div>
    </Space>
  );
};

export default CompareConfigTitle;
