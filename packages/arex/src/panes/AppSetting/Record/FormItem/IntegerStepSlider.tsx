import { InputNumber, Slider, Space, Typography } from 'antd';
import { useTranslation } from 'arex-core';
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
    <div>
      <Space>
        <Slider min={1} max={100} onChange={onChange} value={value} style={{ width: '200px' }} />
        <InputNumber min={1} max={100} value={value} onChange={onChange} />
        <Typography.Text type='secondary'>{t('appSetting.frequencyUnit')} </Typography.Text>
      </Space>
      <div>
        <Typography.Text type='secondary'>
          {t('appSetting.frequencyTip').split('*')[0]}
          <Typography.Text type='danger'>{value * 36 * 24}</Typography.Text>
          {t('appSetting.frequencyTip').split('*')[1]}
        </Typography.Text>
      </div>
    </div>
  );
};

export default IntegerStepSlider;
