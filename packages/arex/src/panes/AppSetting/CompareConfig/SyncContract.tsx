import { EditOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import {
  PaneDrawer,
  SmallTextButton,
  SpaceBetweenWrapper,
  Theme,
  useTranslation,
} from '@arextest/arex-core';
import { Editor, EditorProps } from '@monaco-editor/react';
import { App, Dropdown, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { useUserProfile } from '@/store';
export type SyncContractProps = {
  syncing?: boolean;
  onSync?: React.MouseEventHandler<HTMLElement>;
  onEdit?: () => void;
  onSave?: (value?: string) => void;
} & EditorProps;

const SyncContract: FC<SyncContractProps> = (props) => {
  const { value: _value, syncing = false, onSync, onSave, ...restProps } = props;
  const { t } = useTranslation('common');
  const { message } = App.useApp();
  const { theme } = useUserProfile();

  const [value, setValue] = useState(_value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(_value);
  }, [_value, open]);

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    let prettier = '';

    console.log(value);
    if (value) {
      try {
        prettier = JSON.stringify(JSON.parse(value), null, 2);
      } catch (e) {
        return message.error('invalid json');
      }
    }

    onSave?.(prettier);
    handleClose();
  };

  return (
    <>
      <Dropdown.Button
        size='small'
        type='text'
        placement='bottom'
        disabled={syncing}
        onClick={onSync}
        menu={{
          items: [
            {
              key: 'edit',
              label: 'Edit Contract',
              icon: <EditOutlined />,
            },
          ],
          onClick: ({ key }) => {
            if (key === 'edit') {
              props.onEdit?.();
              setOpen(true);
            }
          },
        }}
      >
        <SyncOutlined spin={syncing} /> Sync
      </Dropdown.Button>

      <PaneDrawer
        open={open}
        width={'50%'}
        title={
          <SpaceBetweenWrapper>
            <Typography.Text>{t('raw')}</Typography.Text>
            <SmallTextButton
              type='primary'
              title={'save'}
              icon={<SaveOutlined />}
              onClick={handleSave}
            />
          </SpaceBetweenWrapper>
        }
        onClose={handleClose}
        bodyStyle={{ padding: '8px 0' }}
      >
        <Editor
          {...restProps}
          value={value}
          onChange={setValue}
          theme={theme === Theme.dark ? 'vs-dark' : 'light'}
          language={'json'}
        />
      </PaneDrawer>
    </>
  );
};

export default SyncContract;
