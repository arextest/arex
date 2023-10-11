import { SaveOutlined } from '@ant-design/icons';
import { SpaceBetweenWrapper } from '@arextest/arex-core';
import { Dropdown, Space } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import EnvironmentSelect from './EnvironmentSelect';
import InfoSummary from './InfoSummary';

const NavigationBar: FC = () => {
  const { onSave, onSaveAs, disableSave } = useArexRequestProps();

  const { store } = useArexRequestStore();
  const { t } = useTranslation();

  const buttonsItems = useMemo(
    () => [
      {
        key: 'saveAs',
        label: t('request.save_as'),
        icon: <SaveOutlined />,
      },
    ],
    [t],
  );

  const onMenuClick = ({ key }: { key: string }) => {
    key === 'saveAs' && onSaveAs?.();
  };

  return (
    <SpaceBetweenWrapper>
      <SpaceBetweenWrapper style={{ marginLeft: '8px', flex: 1 }}>
        <InfoSummary />

        <Space size='middle' style={{ float: 'right', marginRight: '8px' }}>
          <Dropdown.Button
            size='small'
            disabled={disableSave}
            menu={{ items: buttonsItems, onClick: onMenuClick }}
            onClick={() => onSave?.(store.request, store.response)}
          >
            <SaveOutlined />
            {t('request.save')}
          </Dropdown.Button>
        </Space>
      </SpaceBetweenWrapper>

      <EnvironmentSelect />
    </SpaceBetweenWrapper>
  );
};

export default NavigationBar;
