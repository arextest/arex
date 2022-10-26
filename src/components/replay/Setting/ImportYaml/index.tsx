import { useRequest } from 'ahooks';
import { Button, message } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCodeMirror } from '../../../../helpers/editor/codemirror';
import ReplayService from '../../../../services/Replay.service';
import { useStore } from '../../../../store';
import { Label } from '../../../styledComponents';

type ImportYamlProps = {
  appId: string;
  agentVersion: string;
};

const ImportYaml: FC<ImportYamlProps> = (props) => {
  const { t } = useTranslation('common');
  const yamlRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const { themeClassify } = useStore();

  useCodeMirror({
    value,
    container: yamlRef.current,
    height: '600px',
    theme: themeClassify,
    extensions: [],
    onChange(value) {
      setValue(value);
    },
  });

  useEffect(() => {
    ReplayService.queryConfigTemplate({ appId: props.appId }).then((res) => {
      setValue(res.configTemplate);
    });
  }, [props.appId]);

  const { run: updateConfigTemplate } = useRequest(
    () =>
      ReplayService.pushConfigTemplate({
        appId: props.appId,
        configTemplate: value,
      }),
    {
      manual: true,
      onSuccess(res) {
        res.success && message.success('update success');
      },
    },
  );

  return (
    <>
      <div style={{ marginBottom: '8px' }}>
        <Label>Agent Version</Label>
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
    </>
  );
};

export default ImportYaml;
