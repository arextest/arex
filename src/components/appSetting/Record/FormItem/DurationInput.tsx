import { Checkbox, Divider } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');

  const durationOptions: CheckboxOptionType[] = useMemo(() => {
    return [
      { label: t('monday'), value: 0 },
      { label: t('tuesday'), value: 1 },
      { label: t('wednesday'), value: 2 },
      { label: t('thursday'), value: 3 },
      { label: t('friday'), value: 4 },
      { label: t('saturday'), value: 5 },
      { label: t('sunday'), value: 6 },
    ];
  }, []);

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
        {t('everyDay')}
      </Checkbox>
      <Divider style={{ margin: '12px 0', width: '500px' }} />
      <Checkbox.Group options={durationOptions} value={value} onChange={onChange} />
    </div>
  );
};

export default DurationInput;
