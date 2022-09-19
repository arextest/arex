import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Collapse, Form, message, Select, Spin, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { FC } from 'react';
import { useImmer } from 'use-immer';

import ReplayService from '../../../services/Replay.service';
import { DurationInput, IntegerStepSlider, TimeClassCheckbox } from './FormItem';
import DynamicClassesEditableTable from './FormItem/DynamicClassesEditableTable';

const { Panel } = Collapse;

export type SettingRecordProps = {
  appId: string;
  agentVersion: string;
};

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

const SettingRecord: FC<SettingRecordProps> = (props) => {
  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);

  const { loading } = useRequest(ReplayService.queryRecordSetting, {
    defaultParams: [{ id: props.appId }],
    onSuccess(res) {
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
    },
  });

  const { run: update } = useRequest(ReplayService.updateRecordSetting, {
    manual: true,
    onSuccess(res) {
      res && message.success('Update successfully');
    },
  });

  const onFinish = (values: SettingFormType) => {
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
      appId: props.appId,
      sampleRate: values.frequency,
      excludeDependentOperationSet: values.dependentApiNotToRecord,
      excludeDependentServiceSet: values.dependentServicesNotToRecord,
      excludeOperationSet: values.apiNotToRecord,
      includeOperationSet: values.apiToRecord,
      includeServiceSet: values.servicesToRecord,
    };
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

            {/* 此处必须 forceRender，否则如果没有打开高级设置就保存，将丢失高级设置部分字段 */}
            <Panel forceRender header='Advanced' key='advanced'>
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
                {/* TODO 接口暂无该字段 */}
                <TimeClassCheckbox />
              </Form.Item>

              <Form.Item label='Dynamic Classes'>
                <DynamicClassesEditableTable appId={props.appId} />
              </Form.Item>
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
