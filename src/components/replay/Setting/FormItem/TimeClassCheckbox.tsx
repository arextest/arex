import { css } from '@emotion/react';
import { Checkbox, Typography } from 'antd';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { FC, useState } from 'react';

import { FormItemProps } from './index';

const { Text } = Typography;

const javaTimeClassesOptions: CheckboxOptionType[] = [
  {
    label: 'java.time.Instant(now)',
    value: 0,
  },
  {
    label: 'java.time.LocalDate(now)',
    value: 1,
  },
  {
    label: 'java.time.LocalTime(now)',
    value: 2,
  },
  {
    label: 'java.time.LocalDateTime(now)',
    value: 3,
  },
  {
    label: 'java.util.Date(Date)',
    value: 4,
  },
  {
    label: 'java.lang.System(currentTimeMillis)',
    value: 5,
  },
];

const TimeClassCheckbox: FC<FormItemProps<unknown>> = (props) => {
  const [value, setValue] = useState<unknown>(props.value || []);
  const handleChange = (value: unknown) => {
    props.onChange && props.onChange(value);
    setValue(value);
  };
  return (
    <>
      <Checkbox.Group
        className='time-classes'
        value={value}
        options={javaTimeClassesOptions}
        onChange={handleChange}
      />
      <Text
        type='danger'
        css={css`
          margin-top: 8px;
        `}
      >
        (Please confirm the time class used in the code, and use java.lang.System with caution.)
      </Text>
    </>
  );
};

export default TimeClassCheckbox;
