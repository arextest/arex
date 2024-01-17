import { css, HelpTooltip, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, Form, InputNumber, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, useState } from 'react';
import { useImmer } from 'use-immer';

import { InterfaceSelect } from '@/components';
import { ConfigService } from '@/services';
import { QueryRecordSettingRes, SerializeSkipInfo } from '@/services/ConfigService';

import SettingForm from '../../SettingForm';
import {
  DurationInput,
  DynamicClassesEditableTable,
  IntegerStepSlider,
  SerializeSkip,
} from './FormItem';
import RunningStatus from './FormItem/RunningStatus';
import { decodeWeekCode, encodeWeekCode } from './utils';

export type StandardProps = {
  appId: string;
};

type SettingFormType = {
  allowDayOfWeeks: number[];
  sampleRate: number;
  period: Dayjs[];
  excludeServiceOperationSet: string[];
  recordMachineCountLimit?: number;
  includeServiceOperationSet: string[] | undefined;
  serializeSkipInfoList?: SerializeSkipInfo[];
};

const format = 'HH:mm';

const defaultValues: Omit<
  QueryRecordSettingRes,
  'appId' | 'modifiedTime' | 'allowDayOfWeeks' | 'allowTimeOfDayFrom' | 'allowTimeOfDayTo'
> & {
  allowDayOfWeeks: number[];
  period: Dayjs[];
  includeServiceOperationSet: string[];
  serializeSkipInfoList: SerializeSkipInfo[];
} = {
  allowDayOfWeeks: [],
  sampleRate: 1,
  period: [dayjs('00:01', format), dayjs('23:59', format)],
  excludeServiceOperationSet: [],
  recordMachineCountLimit: 1,
  includeServiceOperationSet: [],
  serializeSkipInfoList: [],
};

const Standard: FC<StandardProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [initialValues, setInitialValues] = useImmer<SettingFormType>(defaultValues);
  const [loading, setLoading] = useState(false);

  useRequest(ConfigService.queryRecordSetting, {
    defaultParams: [{ appId: props.appId }],
    onBefore() {
      setLoading(true);
    },
    onSuccess(res) {
      setInitialValues({
        period: [
          dayjs(res.allowTimeOfDayFrom || '00:00', format),
          dayjs(res.allowTimeOfDayTo || '23:59', format),
        ],
        sampleRate: res.sampleRate,
        allowDayOfWeeks: [],
        excludeServiceOperationSet: res.excludeServiceOperationSet?.filter(Boolean),
        recordMachineCountLimit:
          res?.recordMachineCountLimit == undefined ? 1 : res?.recordMachineCountLimit,
        includeServiceOperationSet: res.extendField?.includeServiceOperations
          ?.split(',')
          .filter(Boolean),
        serializeSkipInfoList: res.serializeSkipInfoList ? res.serializeSkipInfoList : undefined,
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
      excludeServiceOperationSet: values.excludeServiceOperationSet?.filter(Boolean),
      recordMachineCountLimit: values.recordMachineCountLimit,
      extendField: {
        includeServiceOperations: values.includeServiceOperationSet?.join(','),
      },
      serializeSkipInfoList: values.serializeSkipInfoList,
    };
    update(params);
  };
  return (
    <SettingForm loading={loading} initialValues={initialValues} onFinish={onFinish}>
      <Collapse
        bordered={false}
        defaultActiveKey={['runningStatus', 'basic']}
        items={[
          {
            key: 'runningStatus',
            label: t('appSetting.runningStatus'),
            children: (
              <>
                <Form.Item label={t('appSetting.recordMachineNum')} name='recordMachineCountLimit'>
                  <InputNumber size='small' min={0} max={10} precision={0} />
                </Form.Item>
                <RunningStatus appId={props.appId} />
              </>
            ),
          },
          {
            key: 'basic',
            label: t('appSetting.basic'),
            children: (
              <>
                <Form.Item label={t('appSetting.duration')} name='allowDayOfWeeks'>
                  <DurationInput />
                </Form.Item>

                <Form.Item label={t('appSetting.period')} name='period'>
                  <TimePicker.RangePicker format={format} />
                </Form.Item>

                <Form.Item label={t('appSetting.frequency')} name='sampleRate'>
                  <IntegerStepSlider />
                </Form.Item>

                <Form.Item label={t('appSetting.serializeSkip')} name='serializeSkipInfoList'>
                  <SerializeSkip />
                </Form.Item>
              </>
            ),
          },
          {
            key: 'advanced',
            label: t('appSetting.advanced'),
            forceRender: true,
            children: (
              <>
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
                  <InterfaceSelect
                    labelAsValue
                    appId={props.appId}
                    open={!!props.appId}
                    placeholder={t('appSetting.inclusionTooltip')}
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
                  <InterfaceSelect
                    labelAsValue
                    appId={props.appId}
                    open={!!props.appId}
                    placeholder={t('appSetting.exclusionTooltip')}
                  />
                </Form.Item>
              </>
            ),
          },
        ]}
        css={css`
          .ant-collapse-header-text {
            font-weight: 600;
          }
        `}
      />

      <Form.Item style={{ float: 'right', margin: '16px 0' }}>
        <Button type='primary' htmlType='submit'>
          {t('save', { ns: 'common' })}
        </Button>
      </Form.Item>
    </SettingForm>
  );
};

export default Standard;
