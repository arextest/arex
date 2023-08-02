import { useTranslation } from '@arextest/arex-core';
import { InputNumber, Slider, Space, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { FormItemProps } from './index';

const IntegerStepSlider: FC<FormItemProps<number>> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  const [value, setInput] = useState(props.value || 1);

  const onChange = (newValue: number | null) => {
    if (newValue) {
      props.onChange?.(newValue);
      setInput(newValue);
    }
  };

  return (
    <>
      <Space>
        <Slider min={0} max={10} onChange={onChange} value={value} style={{ width: '200px' }} />
        <InputNumber precision={0} min={0} max={10} value={value} onChange={onChange} />
        <Typography.Text type='secondary'>{t('appSetting.frequencyUnit')} </Typography.Text>
      </Space>

      <div>
        <Typography.Text type='secondary'>
          {t('appSetting.frequencyTip').split('*')[0]}
          <Typography.Text type='danger'>{value * 60 * 24}</Typography.Text>
          {t('appSetting.frequencyTip').split('*')[1]}
        </Typography.Text>
      </div>
    </>
  );
};

export default IntegerStepSlider;
