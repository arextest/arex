import { Label, useTranslation } from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { App, Button } from 'antd';
import React, { FC, useState } from 'react';

import { ConfigService } from '@/services';
import { useUserProfile } from '@/store';

type ImportYamlProps = {
  appId: string;
};

const ImportYaml: FC<ImportYamlProps> = (props) => {
  const { message } = App.useApp();
  const { theme } = useUserProfile();
  const { t } = useTranslation(['common', 'components']);
  const [value, setValue] = useState('');

  useRequest(ConfigService.queryConfigTemplate, {
    defaultParams: [{ appId: props.appId }],
    refreshDeps: [props.appId],
    onSuccess(res) {
      setValue(res.configTemplate);
    },
  });

  const { run: updateConfigTemplate } = useRequest(
    () =>
      ConfigService.updateConfigTemplate({
        appId: props.appId,
        configTemplate: value,
      }),
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.updateSuccess'));
      },
    },
  );

  return (
    <>
      <Editor
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={value}
        language={'yaml'}
        height={'400px'}
        onChange={(value) => {
          setValue(value || '');
        }}
      />

      <Button
        type={'primary'}
        onClick={updateConfigTemplate}
        style={{ float: 'right', marginTop: '16px' }}
      >
        {t('save')}
      </Button>
    </>
  );
};

export default ImportYaml;
