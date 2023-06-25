import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ButtonProps, Space, Typography } from 'antd';
import { TooltipButton, useTranslation } from 'arex-core';
import React, { FC } from 'react';

export type CompareConfigTitleProps = {
  title: string;
  onAdd?: ButtonProps['onClick'];
  onSearch?: ButtonProps['onClick'];
};

const CompareConfigTitle: FC<CompareConfigTitleProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Space>
      <Typography.Text strong>{props.title}</Typography.Text>
      <div>
        <TooltipButton
          key='search'
          icon={<SearchOutlined />}
          title={t('search')}
          onClick={props.onSearch}
        />
        <TooltipButton
          key='add'
          icon={<PlusOutlined />}
          title={t('appSetting.addKey')}
          onClick={props.onAdd}
        />
      </div>
    </Space>
  );
};

export default CompareConfigTitle;
