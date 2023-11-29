import { CopyOutlined } from '@ant-design/icons';
import {
  copyToClipboard,
  css,
  Segmented,
  SpaceBetweenWrapper,
  Theme,
  TooltipButton,
  tryPrettierJsonString,
  useArexCoreConfig,
} from '@arextest/arex-core';
import { Editor } from '@monaco-editor/react';
import { App } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ArexRESTResponse } from '../../types';

enum DisplayMode {
  'Pretty' = 'Pretty',
  'Raw' = 'Raw',
  'Preview' = 'Preview',
}

const ResponseBody: FC<{ response?: ArexRESTResponse }> = ({ response }) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { theme } = useArexCoreConfig();

  const [displayMode, setDisplayMode] = useState(DisplayMode.Pretty);

  const bodyValue = useMemo(() => {
    if (response?.type === 'success' || response?.type === 'fail') {
      return displayMode === DisplayMode.Pretty
        ? tryPrettierJsonString(response?.body)
        : response?.body;
    }
  }, [response, displayMode]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <SpaceBetweenWrapper style={{ margin: '4px' }}>
        <Segmented
          size='small'
          value={displayMode}
          options={['Pretty', 'Raw', 'Preview']}
          onChange={(value) => setDisplayMode(value as DisplayMode)}
        />
        <TooltipButton
          placement='left'
          color='primary'
          title={t('action.copy')}
          icon={<CopyOutlined />}
          onClick={() => {
            copyToClipboard(bodyValue || '');
            message.success('copy success');
          }}
        />
      </SpaceBetweenWrapper>

      <div
        css={css`
          flex: 1;
          overflow-y: auto;
        `}
      >
        {displayMode !== DisplayMode.Preview ? (
          <Editor
            language={displayMode === DisplayMode.Pretty ? 'json' : 'text'}
            theme={theme === Theme.dark ? 'vs-dark' : 'light'}
            value={bodyValue}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 12,
              wordWrap: 'on',
              automaticLayout: true,
              fontFamily: 'IBMPlexMono, "Courier New", monospace',
              scrollBeyondLastLine: false,
              readOnly: true,
            }}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: bodyValue }} />
        )}
      </div>
    </div>
  );
};

export default ResponseBody;
