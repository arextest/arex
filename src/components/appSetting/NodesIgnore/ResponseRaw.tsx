import { json } from '@codemirror/lang-json';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Button, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import useUserProfile from '../../../store/useUserProfile';
import { SpaceBetweenWrapper } from '../../styledComponents';

export type ResponseRawProps = {
  hiddenAction?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
} & ReactCodeMirrorProps;

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

      <CodeMirror
        {...restProps}
        extensions={[json()]}
        theme={theme}
        height='auto'
        minHeight={'100px'}
        maxHeight={'600px'}
      />
    </>
  );
};

export default ResponseRaw;
