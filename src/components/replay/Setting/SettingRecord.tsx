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
  Row,
  Select,
  Slider,
  Spin,
  TimePicker,
  Typography,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { FC, useState } from 'react';

import ReplayService from '../../../services/Replay.service';

const { Panel } = Collapse;
const { Text } = Typography;

export type SettingRecordProps = {
  id: string;
  agentVersion: string;
};

type FormItemProps<T> = { value?: T; onChange?: (value: T) => void };

const durationOptions = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
const javaTimeClassesOptions = [
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

const DurationInput: FC<FormItemProps<string[]>> = (props) => {
  const [value, setValue] = useState<string[]>(props.value || []);
  const [indeterminate, setIndeterminate] = useState(
    Boolean(props.value?.length && props.value?.length < 7),
  );
  const [checkAll, setCheckAll] = useState(props.value?.length === 7);

  const onChange = (list: CheckboxValueType[]) => {
    props.onChange && props.onChange(list as string[]);
    setValue(list as string[]);
    setIndeterminate(!!list.length && list.length < durationOptions.length);
    setCheckAll(list.length === durationOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setValue(e.target.checked ? durationOptions : []);
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
  const { data, loading } = useRequest(ReplayService.queryRecordSetting, {
    defaultParams: [{ id: props.id }],
    onSuccess(res) {
      console.log(res);
    },
  });

  const onFinish = (values: any) => {
    console.log(values);
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

              <Form.Item label='Duration' name='Duration'>
                <DurationInput />
              </Form.Item>

              <Form.Item label='Period' name='period'>
                <TimePicker.RangePicker />
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

          <Form.Item style={{ float: 'right', margin: '16px' }}>
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
