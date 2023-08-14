import { useTranslation } from '@arextest/arex-core';
import { Select, Typography } from 'antd';
import React, { FC } from 'react';

export type DataEncryptionNodeConfigProps = {
  path?: string[];
  value?: string;
  onChange?: (value: string) => void;
};

const DataEncryptionNodeConfig: FC<DataEncryptionNodeConfigProps> = (props) => {
  const { t } = useTranslation('components');
  return (
    <>
      <div style={{ marginBottom: '8px' }}>
        <Typography.Text type='secondary'> Node data encryption config: </Typography.Text>
        <Typography.Text strong>{props.path?.join('/')}</Typography.Text>
      </div>
      <Select
        value={props.value}
        options={[
          { label: 'MD5加解密', value: 'md5' },
          { label: 'SHA1加解密', value: 'sha1' },
        ]}
        placeholder={t('appSetting.chooseEncryptionMethodName')}
        onChange={props.onChange}
        style={{ width: '200px' }}
      />
    </>
  );
};

export default DataEncryptionNodeConfig;
