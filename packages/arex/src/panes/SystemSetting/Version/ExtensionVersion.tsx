import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { Button, Input, InputProps, Space } from 'antd';
import React, { FC, useMemo } from 'react';

import { isClient, MessageType, URL_CHROME_EXTENSION } from '@/constant';
import { useMessageQueue } from '@/store';

const ExtensionVersion: FC<InputProps> = (props) => {
  const { t } = useTranslation('components');
  const { messageQueue } = useMessageQueue();
  const messageDetected = useMemo(
    () => messageQueue.find((message) => message.type === MessageType.extension),
    [messageQueue],
  );
  return (
    <Space size='middle'>
      <Input readOnly variant='borderless' {...props} />
      {!isClient && messageDetected && (
        <Button
          size='small'
          type='primary'
          href={URL_CHROME_EXTENSION}
          target='_blank'
          icon={<DownloadOutlined />}
        >
          {t('systemSetting.downloadExtension')}
        </Button>
      )}
    </Space>
  );
};

export default ExtensionVersion;
