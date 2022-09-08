import { useMount } from 'ahooks';
import { Button, message } from 'antd';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { FC, useEffect, useRef, useState, VFC } from 'react';

import ReplayService from '../../../services/Replay.service';
import { useStore } from '../../../store';
import { SettingRecordProps } from './SettingRecord';

const SettingImportYaml: FC<SettingRecordProps> = (props) => {
  const { themeClassify } = useStore();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  useEffect(() => {
    // TODO 主题需要适配
    if (monacoEl && !editor) {
      setEditor(
        monaco.editor.create(monacoEl.current!, {
          value: '',
          language: 'yaml',
          theme: themeClassify === 'light' ? 'vs' : 'vs-dark',
        }),
      );
    }

    ReplayService.queryConfigTemplate({ appId: props.id }).then((res) => {
      editor?.setValue(res.configTemplate);
    });

    editor?.onDidChangeModelContent((e) => {
      console.log(editor?.getValue(), 'editor?.getValue()');
    });

    return () => editor?.dispose();
  }, [monacoEl.current]);

  function update() {
    ReplayService.pushConfigTemplate({
      appId: props.id,
      configTemplate: editor?.getValue(),
    }).then((res) => {
      if (res.success) {
        message.success('update success');
      }
    });
  }

  return (
    <div>
      <div style={{ width: '100%', height: '70vh' }} ref={monacoEl}></div>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <Button type={'primary'} onClick={update}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default SettingImportYaml;
