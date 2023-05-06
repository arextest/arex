// import { json } from '@codemirror/lang-json';
// import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Button, Input, Space } from 'antd';
import { SpaceBetweenWrapper, useTranslation } from 'arex-core';
import React, { FC } from 'react';

import { useUserProfile } from '@/store';

export type ResponseRawProps = {
  value?: string;
  onChange?: (value: string) => void;
  hiddenAction?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
};
// & ReactCodeMirrorProps;

const ResponseRaw: FC<ResponseRawProps> = (props) => {
  const { hiddenAction, onSave, onCancel, ...restProps } = props;

  const { theme } = useUserProfile();
  const { t } = useTranslation('common');

  return (
    <>
      <SpaceBetweenWrapper style={{ paddingBottom: '8px' }}>
        <h3>{t('raw')}</h3>
        {!hiddenAction && (
          <Space>
            <Button size='small' onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button size='small' type='primary' onClick={onSave}>
              {t('save')}
            </Button>
          </Space>
        )}
      </SpaceBetweenWrapper>

      {/*<CodeMirror*/}
      {/*  {...restProps}*/}
      {/*  extensions={[json()]}*/}
      {/*  theme={theme}*/}
      {/*  height='auto'*/}
      {/*  minHeight={'100px'}*/}
      {/*  maxHeight={'600px'}*/}
      {/*/>*/}
      {/*  TODO use monaco editor */}
      <Input.TextArea
        value={props.value}
        onChange={(e) => props.onChange?.(e.currentTarget.value)}
      ></Input.TextArea>
    </>
  );
};

export default ResponseRaw;
