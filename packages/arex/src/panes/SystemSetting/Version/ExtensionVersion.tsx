import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { Button, Input, InputProps, Space } from 'antd';
import React, { FC, useMemo } from 'react';

import { isClient, MessageType } from '@/constant';
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
      <Input readOnly bordered={false} {...props} />
      {!isClient && messageDetected && (
        <Button
          size='small'
          type='primary'
          href='https://chromewebstore.google.com/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj'
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
