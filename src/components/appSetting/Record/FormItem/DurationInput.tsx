import { Checkbox, Divider } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { FC, useState } from 'react';

import { FormItemProps } from './index';

const durationOptions: CheckboxOptionType[] = [
  { label: 'Mon.', value: 0 },
  { label: 'Tues.', value: 1 },
  { label: 'Wed.', value: 2 },
  { label: 'Thur.', value: 3 },
  { label: 'Fri.', value: 4 },
  { label: 'Sat.', value: 5 },
  { label: 'Sun.', value: 6 },
];

const DurationInput: FC<FormItemProps<number[]>> = (props) => {
  const [value, setValue] = useState<number[]>(props.value || []);
  const [checkAll, setCheckAll] = useState(props.value?.length === durationOptions.length);

  const onChange = (list: CheckboxValueType[]) => {
    setValue(list as number[]);
    props.onChange && props.onChange(list as number[]);

    setCheckAll(list.length === durationOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const _value = e.target.checked ? durationOptions.map((o) => o.value as number) : [];
    setValue(_value);
    props.onChange && props.onChange(_value);

    setCheckAll(e.target.checked);
  };

  return (
    <div style={{ marginTop: '4px' }}>
      <Checkbox checked={checkAll} onChange={onCheckAllChange}>
        Every Day
      </Checkbox>
      <Divider style={{ margin: '12px 0', width: '500px' }} />
      <Checkbox.Group options={durationOptions} value={value} onChange={onChange} />
    </div>
  );
};

export default DurationInput;
