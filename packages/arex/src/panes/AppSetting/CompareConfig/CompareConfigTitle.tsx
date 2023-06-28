import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { TooltipButton, useTranslation } from '@arextest/arex-core';
import { ButtonProps, Space, Typography } from 'antd';
import React, { FC } from 'react';

export type CompareConfigTitleProps = {
  title: string;
  readOnly?: boolean;
  onAdd?: ButtonProps['onClick'];
  onSearch?: ButtonProps['onClick'];
};

const CompareConfigTitle: FC<CompareConfigTitleProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Space>
      <Typography.Text strong>{props.title}</Typography.Text>
      <div className='compare-config-title-actions'>
        <TooltipButton
          key='search'
          icon={<SearchOutlined />}
          title={t('search')}
          onClick={props.onSearch}
        />

        {!props.readOnly && (
          <TooltipButton
            key='add'
            icon={<PlusOutlined />}
            title={t('appSetting.addKey')}
            onClick={props.onAdd}
          />
        )}
      </div>
    </Space>
  );
};

export default CompareConfigTitle;
