import { SaveOutlined } from '@ant-design/icons';
import { css, SpaceBetweenWrapper } from '@arextest/arex-core';
import { Button, Dropdown } from 'antd';
import { DropdownButtonProps } from 'antd/es/dropdown';
import React, { forwardRef, FunctionComponent, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import EnvironmentSelect from './EnvironmentSelect';
import InfoSummary from './InfoSummary';

export interface NavigationBarRef {
  save: (id?: string) => void;
}
const NavigationBar = forwardRef<NavigationBarRef>((_, ref) => {
  const { onSave, onSaveAs, disableSave } = useArexRequestProps();

  const { store } = useArexRequestStore();
  const { t } = useTranslation();

  useImperativeHandle(
    ref,
    () => ({
      save: (id?: string) =>
        onSave?.(id ? { ...store.request, id } : store.request, store.response),
    }),
    [onSave, store],
  );

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
        <div id='arex-request-save-button'>
          {React.createElement<DropdownButtonProps>(
            onSaveAs ? Dropdown.Button : (Button as FunctionComponent),
            {
              size: 'small',
              disabled: disableSave,
              menu: onSaveAs && { items: buttonsItems, onClick: onMenuClick },
              onClick: () => onSave?.(store.request, store.response),
              style: { marginRight: '8px' },
            },
            <>
              <SaveOutlined style={{ marginRight: '4px' }} />
              {t('request.save')}
            </>,
          )}
        </div>

        <EnvironmentSelect />
      </div>
    </SpaceBetweenWrapper>
  );
});

export default NavigationBar;
