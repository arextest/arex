import { Button, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { useCodeMirror } from '../../../../helpers/editor/codemirror';
import ReplayService from '../../../../services/Replay.service';

const ImportYaml = ({ appId, agentVersion }) => {
  const yamlRef = useRef(null);
  const [value, setValue] = useState('');

  useCodeMirror({
    container: yamlRef.current,
    value: value,
    height: '600px',
    extensions: [],
    onChange(value) {
      setValue(value);
    },
  });

  useEffect(() => {
    ReplayService.queryConfigTemplate({ appId: appId }).then((res) => {
      setValue(res.configTemplate);
    });
  }, [appId]);

  function update() {
    ReplayService.pushConfigTemplate({
      appId: appId,
      configTemplate: value,
    }).then((res) => {
      if (res.success) {
        message.success('update success');
      }
    });
  }

  return (
    <div>
      {JSON.stringify(appId)}
      {JSON.stringify(agentVersion)}

      <div ref={yamlRef}></div>

      <div style={{ textAlign: 'right', marginTop: '16px' }}>
        <Button type={'primary'} onClick={update}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImportYaml;
