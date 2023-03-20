import { Select, Typography } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const Authorization: FC = () => {
  const { t } = useTranslation(['components']);
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Text>{t('authorization.header_description')}</Text>
      </div>
      <div style={{ padding: '10px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '200px', display: 'inline-block' }}>
            <Text strong>{t('authorization.type')}</Text>
          </div>
          <Select
            style={{ width: '200px' }}
            options={[
              {
                value: 'parent',
                label: t('authorization.type_parent'),
              },
            ]}
            disabled
            value={'parent'}
          />
        </div>
        <Text type='secondary'>{t('authorization.footer_description')}</Text>
      </div>
    </div>
  );
};

export default Authorization;
