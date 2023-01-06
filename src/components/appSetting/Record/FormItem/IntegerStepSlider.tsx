import { Col, InputNumber, Row, Slider } from 'antd';
import React, { FC, useState } from 'react';

import { FormItemProps } from './index';

const IntegerStepSlider: FC<FormItemProps<number>> = (props) => {
  const [value, setInput] = useState(props.value || 1);

  const onChange = (newValue: number | null) => {
    if (newValue) {
      props.onChange?.(newValue);
      setInput(newValue);
    }
  };

  return (
    <Row>
      <Col span={12}>
        <Slider min={1} max={100} onChange={onChange} value={value} />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={100}
          style={{ margin: '0 16px' }}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default IntegerStepSlider;
