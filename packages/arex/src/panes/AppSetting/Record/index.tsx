import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Collapse, Form, InputNumber, Select, TimePicker } from 'antd';
import { HelpTooltip, useTranslation } from 'arex-core';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, useState } from 'react';
import { useImmer } from 'use-immer';

import { ApplicationService, ConfigService } from '@/services';
import { QueryRecordSettingRes } from '@/services/ConfigService';

import SettingForm from '../SettingForm';
import { DurationInput, DynamicClassesEditableTable, IntegerStepSlider } from './FormItem';
import RunningStatus from './FormItem/RunningStatus';
import { decodeWeekCode, encodeWeekCode } from './utils';

export type SettingRecordProps = {
  appId: string;
};

type SettingFormType = {
  allowDayOfWeeks: number[];
  sampleRate: number;
  period: Dayjs[];
  timeMock: boolean;
  excludeServiceOperationSet: string[];
  recordMachineCountLimit?: number;
  includeServiceOperationSet: string[] | undefined;
};

const format = 'HH:mm';

const defaultValues: Omit<
  QueryRecordSettingRes,
  'appId' | 'modifiedTime' | 'allowDayOfWeeks' | 'allowTimeOfDayFrom' | 'allowTimeOfDayTo'
> & {
  allowDayOfWeeks: number[];
  period: Dayjs[];
  includeServiceOperationSet: string[];
} = {
  allowDayOfWeeks: [],
  sampleRate: 1,
  period: [dayjs('00:01', format), dayjs('23:59', format)],
  timeMock: false,
  excludeServiceOperationSet: [],
  recordMachineCountLimit: 1,
  includeServiceOperationSet: [],
};

const SettingRecord: FC<SettingRecordProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);
  const [loading, setLoading] = useState(false);

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(
    () => ApplicationService.queryInterfacesList<'Global'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );

  useRequest(ConfigService.queryRecordSetting, {
    defaultParams: [{ id: props.appId }],
    onBefore() {
      setLoading(true);
    },
    onSuccess(res) {
      setInitialValues({
        period: [dayjs(res.allowTimeOfDayFrom, format), dayjs(res.allowTimeOfDayTo, format)],
        sampleRate: res.sampleRate,
        allowDayOfWeeks: [],
        timeMock: res.timeMock,
        excludeServiceOperationSet: res.excludeServiceOperationSet?.filter(Boolean),
        recordMachineCountLimit:
          res?.recordMachineCountLimit == undefined ? 1 : res?.recordMachineCountLimit,
        includeServiceOperationSet: res.extendField?.includeServiceOperations.split(','),
      });

      setInitialValues((state) => {
        state.allowDayOfWeeks = decodeWeekCode(res.allowDayOfWeeks);
      });

      setLoading(false);
    },
  });

  const { run: update } = useRequest(ConfigService.updateRecordSetting, {
    manual: true,
    onSuccess(res) {
      res && message.success(t('message.updateSuccess', { ns: 'common' }));
    },
  });

  const onFinish = (values: SettingFormType) => {
    const allowDayOfWeeks = encodeWeekCode(values.allowDayOfWeeks);
    const [allowTimeOfDayFrom, allowTimeOfDayTo] = values.period.map((m: any) => m.format(format));

    const params = {
      allowDayOfWeeks,
      allowTimeOfDayFrom,
      allowTimeOfDayTo,
      appId: props.appId,
      sampleRate: values.sampleRate,
      timeMock: values.timeMock,
      excludeServiceOperationSet: values.excludeServiceOperationSet?.filter(Boolean),
      recordMachineCountLimit: values.recordMachineCountLimit,
      extendField: values.includeServiceOperationSet?.length
        ? {
            includeServiceOperations: values.includeServiceOperationSet?.join(','),
          }
        : null,
    };
    update(params);
  };
  return (
    <SettingForm loading={loading} initialValues={initialValues} onFinish={onFinish}>
      <Collapse
        bordered={false}
        defaultActiveKey={['runningStatus', 'basic']}
        css={css`
          .ant-collapse-header-text {
            font-weight: 600;
          }
        `}
      >
        <Collapse.Panel header={t('appSetting.runningStatus')} key='runningStatus'>
          <Form.Item label={t('appSetting.recordMachineNum')} name='recordMachineCountLimit'>
            <InputNumber size='small' min={0} max={10} precision={0} />
          </Form.Item>
          <RunningStatus appId={props.appId} />
        </Collapse.Panel>

        <Collapse.Panel header={t('appSetting.basic')} key='basic'>
          <Form.Item label={t('appSetting.duration')} name='allowDayOfWeeks'>
            <DurationInput />
          </Form.Item>

          <Form.Item label={t('appSetting.period')} name='period'>
            <TimePicker.RangePicker format={format} />
          </Form.Item>

          <Form.Item label={t('appSetting.frequency')} name='sampleRate'>
            <IntegerStepSlider />
          </Form.Item>
        </Collapse.Panel>

        {/* 此处必须 forceRender，否则如果没有打开高级设置就保存，将丢失高级设置部分字段 */}
        <Collapse.Panel forceRender header={t('appSetting.advanced')} key='advanced'>
          <Form.Item label={t('appSetting.timeMock')} name='timeMock' valuePropName='checked'>
            <Checkbox />
          </Form.Item>

          <Form.Item
            label={
              <HelpTooltip title={t('appSetting.dynamicClassesTooltip')}>
                {t('appSetting.dynamicClasses')}
              </HelpTooltip>
            }
          >
            <DynamicClassesEditableTable appId={props.appId} />
          </Form.Item>

          <Form.Item
            label={
              <HelpTooltip title={t('appSetting.inclusionTooltip')}>
                {t('appSetting.inclusion')}
              </HelpTooltip>
            }
            name='includeServiceOperationSet'
          >
            <Select
              allowClear
              mode='tags'
              options={[...new Set(operationList.map((item) => item.operationName))]
                .filter(Boolean)
                .map((name) => ({
                  label: name,
                  value: name,
                }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <HelpTooltip title={t('appSetting.exclusionTooltip')}>
                {t('appSetting.exclusion')}
              </HelpTooltip>
            }
            name='excludeServiceOperationSet'
          >
            <Select
              allowClear
              mode='tags'
              options={[...new Set(operationList.map((item) => item.operationName))]
                .filter(Boolean)
                .map((name) => ({
                  label: name,
                  value: name,
                }))}
            />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>

      <Form.Item style={{ float: 'right', margin: '16px 0' }}>
        <Button type='primary' htmlType='submit'>
          {t('save', { ns: 'common' })}
        </Button>
      </Form.Item>
    </SettingForm>
  );
};

export default SettingRecord;
