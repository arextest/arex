import { MenuOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Collapse, CollapseProps, Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../store';

const { Panel } = Collapse;

const PreRequestScript = () => {
  const { t } = useTranslation('common');
  const { themeClassify } = useStore();

  return (
    <Collapse
      accordion
      collapsible='header'
      expandIcon={() => (
        <Button
          size='small'
          type='text'
          icon={<MenuOutlined />}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ cursor: 'move' }}
        />
      )}
    >
      {['0', '1', '2'].map((index) => (
        <Panel header='自定义代码块' key={index}>
          <>
            <Button type='primary' size='small' style={{ marginBottom: '8px' }}>
              {t('save')}
            </Button>
            <CodeMirror height='300px' extensions={[javascript()]} theme={themeClassify} />
          </>
        </Panel>
      ))}
    </Collapse>
  );
};

export default PreRequestScript;
