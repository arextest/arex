import { SaveOutlined } from '@ant-design/icons';
import { css, SpaceBetweenWrapper } from '@arextest/arex-core';
import { Dropdown } from 'antd';
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
      <div
        css={css`
          ::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
        `}
        style={{ width: '100%', marginLeft: '8px', overflow: 'overlay' }}
      >
        <InfoSummary />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Dropdown.Button
          size='small'
          disabled={disableSave}
          menu={{ items: buttonsItems, onClick: onMenuClick }}
          onClick={() => onSave?.(store.request, store.response)}
          style={{ marginRight: '8px' }}
        >
          <SaveOutlined />
          {t('request.save')}
        </Dropdown.Button>
        <EnvironmentSelect />
      </div>
    </SpaceBetweenWrapper>
  );
};

export default NavigationBar;
