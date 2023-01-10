import { useRequest } from 'ahooks';
import { App, Button } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import AppSettingService from '../../../services/AppSetting.service';
import { Theme } from '../../../theme';
import { Label } from '../../styledComponents';

type ImportYamlProps = {
  appId: string;
  agentVersion: string;
};

const ImportYaml: FC<ImportYamlProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'components']);
  const yamlRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');

  useCodeMirror({
    value,
    container: yamlRef.current,
    height: '600px',
    theme: Theme.dark,
    extensions: [],
    onChange(value) {
      setValue(value);
    },
  });

  useRequest(AppSettingService.queryConfigTemplate, {
    defaultParams: [{ appId: props.appId }],
    refreshDeps: [props.appId],
    onSuccess(res) {
      setValue(res.configTemplate);
    },
  });

  const { run: updateConfigTemplate } = useRequest(
    () =>
      AppSettingService.updateConfigTemplate({
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
    <div>
      <div style={{ marginBottom: '8px' }}>
        <Label>{t('appSetting.agentVersion', { ns: 'components' })}</Label>
        {props.agentVersion}
      </div>

      <div ref={yamlRef} />

      <Button
        type={'primary'}
        onClick={updateConfigTemplate}
        style={{ float: 'right', marginTop: '16px' }}
      >
        {t('save')}
      </Button>
    </div>
  );
};

export default ImportYaml;
