import { EditOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { Editor, EditorProps } from '@monaco-editor/react';
import { App, Dropdown, Typography } from 'antd';
import { SmallTextButton, SpaceBetweenWrapper, Theme, useTranslation } from '@arextest/arex-core';
import React, { FC, useEffect, useState } from 'react';

import PaneDrawer from '@/components/PaneDrawer';
import { useUserProfile } from '@/store';

export type ResponseRawProps = {
  onSave?: (value?: string) => void;
} & EditorProps;

const SyncResponse: FC<ResponseRawProps> = (props) => {
  const { value: _value, onSave, ...restProps } = props;
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
        onClick={() => {
          console.log('handle sync response');
        }}
        menu={{
          items: [
            {
              key: 'edit',
              label: 'Edit Response',
              icon: <EditOutlined />,
            },
          ],
          onClick: ({ key }) => {
            key === 'edit' && setOpen(true);
          },
        }}
      >
        <SyncOutlined /> SyncResponse
      </Dropdown.Button>

      <PaneDrawer
        noPadding
        open={open}
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
      >
        <Editor
          {...restProps}
          value={value}
          onChange={setValue}
          theme={theme === Theme.dark ? 'vs-dark' : 'light'}
          language={'json'}
          height={'400px'}
        />
      </PaneDrawer>
    </>
  );
};

export default SyncResponse;
