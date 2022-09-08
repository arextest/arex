import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Slider,
  Spin,
  TimePicker,
  Typography,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import moment, { Moment } from 'moment';
import { FC, useState } from 'react';
import { useImmer } from 'use-immer';

import ReplayService from '../../../services/Replay.service';

const { Panel } = Collapse;
const { Text } = Typography;

export type SettingRecordProps = {
  id: string;
  agentVersion: string;
};

type FormItemProps<T> = { value?: T; onChange?: (value: T) => void };
type SettingFormType = {
  allowDayOfWeeks: number[];
  frequency: number;
  period: Moment[];
  apiNotToRecord: string[];
  dependentApiNotToRecord: string[];
  dependentServicesNotToRecord: string[];
  apiToRecord: string[];
  servicesToRecord: string[];
};

const format = 'HH:mm';

const defaultValues = {
  allowDayOfWeeks: [],
  frequency: 1,
  period: [moment('00:01', format), moment('23:59', format)],
  apiNotToRecord: [],
  dependentApiNotToRecord: [],
  dependentServicesNotToRecord: [],
  apiToRecord: [],
  servicesToRecord: [],
};

const durationOptions: CheckboxOptionType[] = [
  { label: 'Sun.', value: 0 },
  { label: 'Mon.', value: 1 },
  { label: 'Tues.', value: 2 },
  { label: 'Wed.', value: 3 },
  { label: 'Thur.', value: 4 },
  { label: 'Fri.', value: 5 },
  { label: 'Sat.', value: 6 },
];

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

const DurationInput: FC<FormItemProps<number[]>> = (props) => {
  const [value, setValue] = useState<number[]>(props.value || []);
  const [indeterminate, setIndeterminate] = useState(
    Boolean(props.value?.length && props.value?.length < durationOptions.length),
  );
  const [checkAll, setCheckAll] = useState(props.value?.length === durationOptions.length);

  const onChange = (list: CheckboxValueType[]) => {
    setValue(list as number[]);
    props.onChange && props.onChange(list as number[]);

    setIndeterminate(!!list.length && list.length < durationOptions.length);
    setCheckAll(list.length === durationOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const _value = e.target.checked ? durationOptions.map((o) => o.value as number) : [];
    setValue(_value);
    props.onChange && props.onChange(_value);

    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div style={{ marginTop: '4px' }}>
      <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>
        Every Day
      </Checkbox>
      <Divider style={{ margin: '12px 0', width: '500px' }} />
      <Checkbox.Group options={durationOptions} value={value} onChange={onChange} />
    </div>
  );
};

const IntegerStepSlider: FC<FormItemProps<number>> = (props) => {
  const [value, setInput] = useState(props.value || 1);

  const onChange = (newValue: number) => {
    props.onChange && props.onChange(newValue);
    setInput(newValue);
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

// TODO 接口暂无该字段
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
const SettingRecord: FC<SettingRecordProps> = (props) => {
  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);

  const { loading } = useRequest(ReplayService.queryRecordSetting, {
    defaultParams: [{ id: props.id }],
    onSuccess(res) {
      console.log(res);
      setInitialValues(() => ({
        period: [moment(res.allowTimeOfDayFrom, format), moment(res.allowTimeOfDayTo, format)],
        frequency: res.sampleRate,
        allowDayOfWeeks: [],
        apiNotToRecord: res.excludeOperationSet,
        dependentApiNotToRecord: res.excludeDependentOperationSet,
        dependentServicesNotToRecord: res.excludeDependentServiceSet,
        apiToRecord: res.includeOperationSet,
        servicesToRecord: res.includeServiceSet,
      }));

      // decode allowDayOfWeeks
      !res.allowDayOfWeeks && (res.allowDayOfWeeks = 254);
      res.allowDayOfWeeks
        .toString(2)
        .padStart(8, '0')
        .split('')
        .reverse()
        .slice(1, 8)
        .forEach(
          (status, index) =>
            status === '1' &&
            setInitialValues((state) => {
              state.allowDayOfWeeks.push(index);
            }),
        );
      console.log(initialValues);
    },
  });

  const { run: update } = useRequest(ReplayService.updateRecordSetting, {
    manual: true,
    onSuccess(res) {
      res && message.success('Update successfully');
    },
  });

  const onFinish = (values: SettingFormType) => {
    console.log(values);
    const allowDayOfWeeksArr = Array(8).fill(0);
    values.allowDayOfWeeks.forEach((item) => {
      allowDayOfWeeksArr[item + 1] = 1;
    });
    let allowDayOfWeeks = parseInt(allowDayOfWeeksArr.reverse().join(''), 2);
    !allowDayOfWeeks && (allowDayOfWeeks = 254); // allowDayOfWeeks 为 0 即无勾选时默认全选

    const [allowTimeOfDayFrom, allowTimeOfDayTo] = values.period.map((m: any) => m.format(format));

    const params = {
      allowDayOfWeeks,
      allowTimeOfDayFrom,
      allowTimeOfDayTo,
      appId: props.id,
      sampleRate: values.frequency,
      excludeDependentOperationSet: values.dependentApiNotToRecord,
      excludeDependentServiceSet: values.dependentServicesNotToRecord,
      excludeOperationSet: values.apiNotToRecord,
      includeOperationSet: values.apiToRecord,
      includeServiceSet: values.servicesToRecord,
    };
    console.log(params);
    update(params);
  };
  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout='horizontal'
          initialValues={initialValues}
          onFinish={onFinish}
          css={css`
            .ant-form-item-label > label {
              white-space: break-spaces;
            }
            .ant-checkbox-group {
            }
            .time-classes {
              label.ant-checkbox-wrapper {
                width: 220px;
                margin-right: 16px;
              }
            }
          `}
        >
          <Collapse
            bordered={false}
            defaultActiveKey={['basic']}
            css={css`
              .ant-collapse-header-text {
                font-weight: 600;
              }
            `}
          >
            <Panel header='Basic' key='basic'>
              <Form.Item label='Agent Version'>{props.agentVersion}</Form.Item>

              <Form.Item label='Duration' name='allowDayOfWeeks'>
                <DurationInput />
              </Form.Item>

              <Form.Item label='Period' name='period'>
                <TimePicker.RangePicker format={format} />
              </Form.Item>

              <Form.Item label='Frequency' name='frequency'>
                <IntegerStepSlider />
              </Form.Item>
            </Panel>

            <Panel header='Advanced' key='advanced'>
              <Form.Item label='API to Record' name='apiToRecord'>
                <Select mode='tags' style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label='API not to Record' name='apiNotToRecord'>
                <Select mode='tags' style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label='Dependent API not to Record' name='dependentApiNotToRecord'>
                <Select mode='tags' style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label='Services to Record' name='servicesToRecord'>
                <Select mode='tags' style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label='Dependent Services not to Record'
                name='dependentServicesNotToRecord'
              >
                <Select mode='tags' style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label='Java Time Classes' name='timeClasses'>
                <TimeClassCheckbox />
              </Form.Item>

              {/* TODO  Dynamic Classes  */}
            </Panel>
          </Collapse>

          <Form.Item style={{ float: 'right', margin: '16px 0' }}>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default SettingRecord;
