import { useTranslation } from '@arextest/arex-core';
import { Select, Typography } from 'antd';
import React, { FC } from 'react';

export type DataEncryptionNodeConfigProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const DataEncryptionNodeConfig: FC<DataEncryptionNodeConfigProps> = (props) => {
  const { t } = useTranslation('components');
  return (
    <>
      <Typography.Title level={5}>Node data encryption config</Typography.Title>
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
