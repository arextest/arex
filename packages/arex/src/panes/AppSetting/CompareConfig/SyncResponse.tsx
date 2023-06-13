import { CodeOutlined, EditOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { Editor, EditorProps } from '@monaco-editor/react';
import { Dropdown, Typography } from 'antd';
import {
  SmallTextButton,
  SpaceBetweenWrapper,
  Theme,
  TooltipButton,
  useTranslation,
} from 'arex-core';
import React, { FC, useEffect, useState } from 'react';

import PaneDrawer from '@/components/PaneDrawer';
import { useUserProfile } from '@/store';

export type ResponseRawProps = {
  onSave?: (value?: string) => void;
} & EditorProps;

const SyncResponse: FC<ResponseRawProps> = (props) => {
  const { value: _value, onSave, ...restProps } = props;
  const { t } = useTranslation('common');
  const { theme } = useUserProfile();

  const [value, setValue] = useState(_value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (!value) return onSave?.();

    let prettier = '';
    try {
      prettier = JSON.stringify(JSON.parse(value), null, 2);
    } catch (e) {
      return console.log('invalid json');
    }

    onSave?.(prettier);
    handleClose();
  };

  return (
    <>
      <Dropdown.Button
        icon={<SyncOutlined />}
        menu={{
          items: [
            {
              key: 'edit response',
              title: 'Edit Response',
              icon: <EditOutlined />,
            },
          ],
        }}
      >
        Sync
      </Dropdown.Button>
      <TooltipButton
        icon={<CodeOutlined />}
        title={t('appSetting.editResponse')}
        onClick={() => setOpen(true)}
      />
      <PaneDrawer
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
        getContainer={false}
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
