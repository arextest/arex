import { json } from '@codemirror/lang-json';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Button } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../../../store';

type ResponseRawProps = {
  onSave: (value?: string) => void;
} & ReactCodeMirrorProps;

const ResponseRaw: FC<ResponseRawProps> = (props) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(props.value);
  const { onSave, ...restProps } = props;
  const { themeClassify } = useStore();

  return (
    <>
      <CodeMirror
        {...restProps}
        onChange={setValue}
        extensions={[json()]}
        theme={themeClassify}
        height='auto'
        minHeight={'100px'}
        maxHeight={'600px'}
      />
      <Button
        size='small'
        onClick={() => onSave(value)}
        style={{
          marginTop: '8px',
          float: 'right',
        }}
      >
        {t('save')}
      </Button>
    </>
  );
};

export default ResponseRaw;
