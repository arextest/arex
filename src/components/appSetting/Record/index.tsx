import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Collapse, Form, Select, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { decodeWeekCode, encodeWeekCode } from '../../../helpers/record/util';
import AppSettingService from '../../../services/AppSetting.service';
import { QueryRecordSettingRes } from '../../../services/AppSetting.type';
import SettingForm from '../SettingForm';
import { DurationInput, DynamicClassesEditableTable, IntegerStepSlider } from './FormItem';
import RunningStatus from './FormItem/RunningStatus';

export type SettingRecordProps = {
  appId: string;
  agentVersion: string;
};

type SettingFormType = {
  allowDayOfWeeks: number[];
  sampleRate: number;
  period: Dayjs[];
  timeMock: boolean;
  excludeServiceOperationSet: string[];
};

const format = 'HH:mm';

const defaultValues: Omit<
  QueryRecordSettingRes,
  'appId' | 'modifiedTime' | 'allowDayOfWeeks' | 'allowTimeOfDayFrom' | 'allowTimeOfDayTo'
> & {
  allowDayOfWeeks: number[];
  period: Dayjs[];
} = {
  allowDayOfWeeks: [],
  sampleRate: 1,
  period: [dayjs('00:01', format), dayjs('23:59', format)],
  timeMock: false,
  excludeServiceOperationSet: [],
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
    () => AppSettingService.queryInterfacesList<'Global'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );

  useRequest(AppSettingService.queryRecordSetting, {
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
      });

      setInitialValues((state) => {
        state.allowDayOfWeeks = decodeWeekCode(res.allowDayOfWeeks);
      });

      setLoading(false);
    },
  });

  const { run: update } = useRequest(AppSettingService.updateRecordSetting, {
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

          <Form.Item label={t('appSetting.dynamicClasses')}>
            <DynamicClassesEditableTable appId={props.appId} />
          </Form.Item>

          <Form.Item
            label={t('appSetting.excludeServiceOperationSet')}
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
