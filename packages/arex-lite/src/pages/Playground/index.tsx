import { Radio, RadioChangeEvent } from 'antd';
import { useState } from 'react';

import DiffJsonViewDemo from './DiffJsonViewDemo';
const optionsWithDisabled = [
  { label: 'DiffJsonViewDemo', value: 'DiffJsonViewDemo' },
  { label: 'Pear', value: 'Pear' },
];

const Playground = () => {
  const onChange2 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio2 checked', value);
    setValue2(value);
  };
  const [value2, setValue2] = useState('DiffJsonViewDemo');
  return (
    <div>
      <Radio.Group
        options={optionsWithDisabled}
        onChange={onChange2}
        value={value2}
        optionType='button'
        buttonStyle='solid'
      />
      {value2 === 'DiffJsonViewDemo' && <DiffJsonViewDemo />}
    </div>
  );
};

export default Playground;
