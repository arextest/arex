import { Button, Space } from 'antd';
import { useTranslation } from '@arextest/arex-core';
import React, { FC } from 'react';

export type ActionButtonProps = {
  small?: boolean;
  onCancel: () => void;
  onSave: (value?: string) => void;
};

const ActionButton: FC<ActionButtonProps> = (props) => {
  const { t } = useTranslation('common');

  return (
    <Space>
      <Button size={props.small ? 'small' : undefined} onClick={() => props.onCancel()}>
        {t('cancel')}
      </Button>
      <Button
        size={props.small ? 'small' : undefined}
        type='primary'
        onClick={() => props.onSave()}
      >
        {t('save')}
      </Button>
    </Space>
  );
};

export default ActionButton;
