import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { Button, Input, theme, Typography } from 'antd';
import React, { FC } from 'react';

export interface PathCollapseHeaderProps {
  search?: string | boolean;
  onChange?: (search: boolean) => void; // enable search mode
  onSearch?: (value: string) => void; // search keyword
}

const PathCollapseHeader: FC<PathCollapseHeaderProps> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(['components']);

  return props.search === false ? (
    <>
      <Typography.Text
        strong
        style={{ fontSize: `${token.fontSizeHeading5}px`, lineHeight: `${token.controlHeight}px` }}
      >
        {t('appSetting.interfaces')}
      </Typography.Text>
      <Button
        size='small'
        type='link'
        icon={<SearchOutlined style={{ color: `${token.colorText}`, marginLeft: '4px' }} />}
        onClick={() => props.onChange?.(true)}
      />
    </>
  ) : (
    <Input.Search
      allowClear
      addonBefore={
        <Button
          type='link'
          size='small'
          onClick={() => props.onChange?.(false)}
          style={{ color: token.colorText }}
        >
          <Typography.Text strong>{t('appSetting.interfaces')} </Typography.Text>
        </Button>
      }
      onSearch={props.onSearch}
    />
  );
};

export default PathCollapseHeader;
