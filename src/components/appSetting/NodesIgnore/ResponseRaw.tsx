import { json } from '@codemirror/lang-json';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Button, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useUserProfile from '../../../store/useUserProfile';
import { SpaceBetweenWrapper } from '../../styledComponents';

type ResponseRawProps = {
  onSave?: (value?: string) => void;
  onCancel?: () => void;
} & ReactCodeMirrorProps;

const ResponseRaw: FC<ResponseRawProps> = (props) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(props.value);
  const { onSave, onCancel, ...restProps } = props;
  const { theme } = useUserProfile();

  return (
    <div>
      <SpaceBetweenWrapper style={{ paddingBottom: '8px' }}>
        <h3>{t('raw')}</h3>
        <Space>
          <Button size='small' onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button size='small' type='primary' onClick={() => onSave && onSave(value)}>
            {t('save')}
          </Button>
        </Space>
      </SpaceBetweenWrapper>

      <CodeMirror
        {...restProps}
        onChange={setValue}
        extensions={[json()]}
        theme={theme}
        height='auto'
        minHeight={'100px'}
        maxHeight={'600px'}
      />
    </div>
  );
};

export default ResponseRaw;
